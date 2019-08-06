const fs = require('fs');
const _ = require('lodash');

exports.about = {
  displayName: 'Eveplate (React Native)',
};

exports.run = async function () {
  const templatesDir = this.templatePath('react-native');
  const packageInfo = await this.ask.forPackageInfo();

  if (!packageInfo) return;

  const { title, name, description, mkDistDir } = packageInfo;
  const outDir = mkDistDir();
  const opts = { name: _.kebabCase(name), description };

  this.create.copy(templatesDir, outDir, ['**'], ['**/*.ejs']);

  this.create.packageJson(
      templatesDir,
      outDir,
      opts
  );

  this.create.fromSource(templatesDir, outDir, opts)('app.json.ejs');

  this.create.gitIgnore(
      outDir,
      this.defaults.ignore.concat([
        '.expo',
        '*.jks',
        '*.p12',
        '*.key',
        '*.mobileprovision*/'
      ])
  );

  this.create.README(templatesDir, outDir, { title });

  this.ask.forNPMInstall(outDir);

  await this.ask.forGitInit(outDir);
};
