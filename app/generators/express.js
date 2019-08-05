const fs = require('fs');
const _ = require('lodash');

const npmModuleLodash = 'lodash';
const npmModuleMomentjs = 'Moment.js';

exports.about = {
    displayName: 'Eveplate API (Node - Express ^4.0)',
};

exports.run = async function () {
    const templatesDir = this.templatePath('express');
    const nameAndTitle = await this.ask.forPackageInfo();

    if (!nameAndTitle) return;

    const { title, description, name, mkDestinationDir } = nameAndTitle;
    const outDir = mkDestinationDir();

    const database = await this.ask.confirm('Want to include MongoDB?', { default: true });
    const auth = await this.ask.confirm('Want to include passport-jwt?', { default: true });

    const modules = await this.ask.promptMultiSelect(
        'Want to include modules?',
        [{
            name: npmModuleLodash,
            checked: true,
        }, {
            name: npmModuleMomentjs,
            checked: true,
        }]
    );

    const opts = { auth, database, modules };

    {
        const filesToExclude = [];

        if (!opts.database) filesToExclude.push('/src/bootstrap/db.js');
        if (!opts.auth) filesToExclude.push('/src/middleware/requireAuth.js');

        this.create.copy(templatesDir, outDir, null, filesToExclude);
    }

    await this.create.file('package.json', () => {
        opts.name = _.kebabCase(name);
        opts.description = description;
        const packageJson = createPackageJson(opts);

        packageJson.dependencies = this.utils
            .sortObjectByKey(packageJson.dependencies);
        packageJson.devDependencies = this.utils
            .sortObjectByKey(packageJson.devDependencies);

        fs.writeFileSync(`${outDir}/package.json`, JSON.stringify(packageJson, null, 4), 'utf8');
    });

    await this.create.file('src/index.js', () =>
        fs.writeFileSync(`${outDir}/src/index.js`, createIndex(opts), 'utf8'));

    this.create.gitIgnore(outDir, [
        '.DS_Store',
        'node_modules/',
        '/dist/',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        'yarn.lock',
        '.idea',
        '*.iml',
        '*.suo',
        '*.sln',
    ]);

    {
        const env = {
            'APP_ENV': 'dev',
            'API_PREFIX': '/api',
            'PORT': 4444,
            'INFURA_API_KEY': '',
            'INFURA_NET': 'ropsten',
            'WALLET_PRIVATE_KEY': '',
            'WALLET_ID': '',
        };

        if (opts.database) {
            env['MONGODB_URI'] = 'mongodb://localhost:27017/devery';
        }

        if (opts.auth) {
            env['JWT_SECRET'] = 'some-secret';
        }

        this.create.env(outDir, this.utils.sortObjectByKey(env));
    }

    this.create.copyREADME(
        templatesDir, outDir, {
            name_internal: name,
            title: title,
            uses_mongodb: opts.database,
            uses_auth: opts.auth
        }
    );
    this.ask.forNPMInstall(outDir);
    await this.ask.forGitInit(outDir);
};


function createIndex(opts) {
    return `import app from './bootstrap/app'
import api from './bootstrap/api'
import devery from './services/devery'
${opts.database ? `import db from './bootstrap/db'

'db(app)'` : ''}
api(app)
devery.init()
    `;
}

function createPackageJson(opts) {
    const packageJson = {
        "name": opts.name,
        "description": opts.description,
        "version": "0.0.1",
        "private": true,
        "author": "<AUTHOR>",
        "license": "<LICENSE>",
        "main": "dist/index.js",
        "dependencies": {
            "@devery/devery": "^0.1.25",
            "body-parser": "^1.16.0",
            "cookie-parser": "^1.4.3",
            "cors": "^2.8.1",
            "cross-fetch": "^3.0.4",
            "crypto": "^1.0.1",
            "dotenv": "^6.2.0",
            "express": "^4.14.1",
            "express-validator": "^5.3.1",
            "global": "^4.3.2",
            "morgan": "^1.8.0",
            "node-gyp": "^3.8.0",
            "query-string": "^6.4.0",
            "request-promise": "^4.2.2",
            "revalidator": "^0.3.1",
            "sanitize-html": "^1.14.1",
            "uuid": "^3.2.1",
            "web3": "^1.2.0",
            "web3-eth": "^1.2.0",
            "winston": "^2.3.1"
        },
        "devDependencies": {
            "backpack-core": "^0.8.3",
        },
        "scripts": {
            "start": "NODE_ENV=development backpack dev",
            "build": "NODE_ENV=production backpack build"
        }
    };

    if (opts.database) {
        packageJson.dependencies["mongoose"] = "^4.10.6";
    }

    if (opts.auth) {
        packageJson.dependencies["jwt-simple"] = "^0.5.1";
        packageJson.dependencies["passport"] = "^0.3.2";
        packageJson.dependencies["passport-jwt"] = "^2.2.1";
    }

    if (opts.modules.indexOf(npmModuleLodash) > -1) {
        packageJson.dependencies['lodash'] = '^4.17.11';
    }
    if (opts.modules.indexOf(npmModuleMomentjs) > -1) {
        packageJson.dependencies['moment'] = '^2.22.2';
    }

    return packageJson;
}
