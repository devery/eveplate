const fs = require('fs');
const _ = require('lodash');

exports.about = {
    displayName: 'Eveplate (Vue)',
};

exports.run = async function () {
    const templatesDir = this.templatePath('vue');
    const nameAndTitle = await this.ask.forPackageInfo();

    if (!nameAndTitle) return;

    const { title, name, description, mkDistDir } = nameAndTitle;
    const outDir = mkDistDir();
    const dist = mkDistDir(`${outDir}/dist`);

    this.create.copy(templatesDir, outDir, ['**'], ['**/*.ejs']);

    this.create.packageJson(
        templatesDir,
        outDir,
        { name: _.kebabCase(name), description }
    );

    this.create.indexHTML(
        `${templatesDir}/dist`,
        dist,
        { title: this.utils.encodeHtml(title) }
    );

    this.create.gitIgnore(
        outDir,
        this.defaults.ignore.concat([
            '/dist/*',
            '!/dist/index.html',
        ])
    );

    this.create.README(templatesDir, outDir, { name });

    this.ask.forNPMInstall(outDir);

    await this.ask.forGitInit(outDir);
};
