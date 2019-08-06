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

    const { title, description, name, mkDistDir } = nameAndTitle;
    const outDir = mkDistDir();

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

    const opts = {
        name: _.kebabCase(name),
        description,

        auth,
        database,

        lodash: modules.indexOf(npmModuleLodash) > -1,
        moment: modules.indexOf(npmModuleMomentjs) > -1
    };

    const filesToExclude = ['**/*.ejs'];

    if (!opts.database) filesToExclude.push('/src/bootstrap/db.js');
    if (!opts.auth) filesToExclude.push('/src/middleware/requireAuth.js');

    this.create.copy(templatesDir, outDir, null, filesToExclude);

    this.create.packageJson(
        templatesDir,
        outDir,
        opts
    );

    this.create.fromSource(templatesDir, `${outDir}/src/`, { database })('index.js.ejs');

    this.create.gitIgnore(outDir, this.defaults.ignore);

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

    this.create.README(
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