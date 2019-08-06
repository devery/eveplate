const _ = require('lodash');

exports.about = {
    displayName: 'Eveplate (Angular)',
};

exports.run = async function () {
    const templatesDir = this.templatePath('angular');
    const packageInfo = await this.ask.forPackageInfo();

    if (!packageInfo) return;

    const { title, name, description, mkDistDir } = packageInfo;
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
        this.defaults.ignore
    );

    this.create.README(
        templatesDir,
        outDir,
        { name }
    );

    this.ask.forNPMInstall(outDir);

    await this.ask.forGitInit(outDir);
};
