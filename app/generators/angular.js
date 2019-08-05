const fs = require('fs');
const _ = require('lodash');

function createPackageJSON(name, description) {
    return {
        "name": name,
        "description": description,
        "version": "0.0.1",
        "private": true,
        "author": "<AUTHOR>",
        "license": "<LICENSE>",
        "main": "index.js",
        "scripts": {
            "start": "webpack-dev-server --mode development",
            "build": "webpack --mode production"
        },
        "keywords": [],
        "dependencies": {
            "@devery/devery": "^0.1.25",
            "@angular/common": "^6.1.6",
            "@angular/compiler": "^6.1.6",
            "@angular/core": "^6.1.6",
            "@angular/forms": "^6.1.6",
            "@angular/platform-browser": "^6.1.6",
            "@angular/platform-browser-dynamic": "^6.1.6",
            "core-js": "^2.5.7",
            "rxjs": "^6.2.2",
            "zone.js": "^0.8.26"
        },
        "devDependencies": {
            "@babel/core": "^7.5.5",
            "@babel/plugin-proposal-class-properties": "^7.5.5",
            "@babel/plugin-proposal-decorators": "^7.0.0",
            "@babel/preset-env": "^7.5.5",
            "@babel/preset-typescript": "^7.0.0",
            "babel-plugin-transform-decorators": "^6.24.1",
            "babel-loader": "^8.0.5",
            "css-loader": "^3.1.0",
            "csv-loader": "^3.0.2",
            "file-loader": "^4.1.0",
            "style-loader": "^0.23.1",
            "webpack": "^4.29.6",
            "webpack-cli": "^3.2.3",
            "webpack-dev-server": "^3.2.1",
            "xml-loader": "^1.2.1"
        }
    };
}

exports.about = {
    displayName: 'Eveplate (Angular)',
};

exports.run = async function () {
    const templatesDir = this.templatePath('angular');
    const packageInfo = await this.ask.forPackageInfo();

    if (!packageInfo) return;

    const { title, name, description, mkDestinationDir } = packageInfo;
    const outDir = mkDestinationDir();

    this.create.copy(templatesDir, outDir, ['**']);

    await this.create.file('package.json', () => {
        const packageJson = createPackageJSON(_.kebabCase(name), description);

        packageJson.dependencies = this.utils.sortObjectByKey(packageJson.dependencies);
        packageJson.devDependencies = this.utils.sortObjectByKey(packageJson.devDependencies);

        fs.writeFileSync(`${outDir}/package.json`, JSON.stringify(packageJson, null, 4), 'utf8');
    });

    await this.create.file('index.html', () => {
        const newContent = fs.readFileSync(`${templatesDir}/dist/index.html`, 'utf8')
            .split('{{ PAGE-TITLE }}')
            .join(this.utils.encodeHtml(title));

        fs.writeFileSync(`${outDir}/dist/index.html`, newContent, 'utf8');
    });

    this.create.gitIgnore(outDir, [
        '.DS_Store',
        'node_modules/',
        '/dist/*',
        '!/dist/index.html',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        'yarn.lock',
        '.idea',
        '*.iml',
        '*.suo',
        '*.sln',
    ]);

    this.create.copyREADME(templatesDir, outDir, { name });
    this.ask.forNPMInstall(outDir);
    await this.ask.forGitInit(outDir);
};
