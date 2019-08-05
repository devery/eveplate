const fs = require('fs');
const _ = require('lodash');

function createAppJson(name, description) {
  return {
    "expo": {
      "name": name,
      "description": description,
      "slug": name,
      "privacy": "unlisted",
      "sdkVersion": "31.0.0",
      "platforms": ["ios", "android"],
      "version": "0.0.1",
      "orientation": "portrait",
      "icon": "./assets/images/icon.png",
      "splash": {
        "image": "./assets/images/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "updates": {
        "fallbackToCacheTimeout": 0
      },
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "supportsTablet": true
      }
    }
  };
}

function createPackageJson(name, description) {
  return {
    "name": name,
    "description": description,
    "private": true,
    "author": "<AUTHOR>",
    "license": "<LICENSE>",
    "main": "node_modules/expo/AppEntry.js",
    "scripts": {
      "start": "expo start",
      "android": "expo start --android",
      "ios": "expo start --ios",
      "eject": "expo eject"
    },
    "dependencies": {
      "@devery/devery": "^0.1.25",
      "expo": "^31.0.2",
      "react": "16.5.0",
      "react-native": "https://github.com/expo/react-native/archive/sdk-32.0.0.tar.gz",
    },
    "devDependencies": {
      "babel-preset-expo": "^5.0.0",
      "expo-cli": "^2.19.4",
    }
  }
}

exports.about = {
  displayName: 'Eveplate (React Native)',
};

exports.run = async function () {
  const templatesDir = this.templatePath('react-native');
  const packageInfo = await this.ask.forPackageInfo();

  if (!packageInfo) return;

  const { title, name, description, mkDestinationDir } = packageInfo;
  const outDir = mkDestinationDir();

  this.create.copy(templatesDir, outDir, ['**']);

  await this.create.file('package.json', () => {
    const packageJson = createPackageJson(_.kebabCase(name), description);

    packageJson.dependencies = this.utils.sortObjectByKey(packageJson.dependencies);
    packageJson.devDependencies = this.utils.sortObjectByKey(packageJson.devDependencies);

    fs.writeFileSync(`${outDir}/package.json`, JSON.stringify(packageJson, null, 4), 'utf8');
  });

  await this.create.file('app.json', () => {
    const packageJson = createAppJson(_.kebabCase(name), description);

    fs.writeFileSync(`${outDir}/app.json`, JSON.stringify(packageJson, null, 4), 'utf8');
  });

  this.create.gitIgnore(outDir, [
    '.DS_Store',
    'node_modules',
    '.expo',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'yarn.lock',
    '.idea',
    '*.iml',
    '*.suo',
    '*.sln',
    '*.jks',
    '*.p12',
    '*.key',
    '*.mobileprovision*/'
  ]);

  this.create.copyREADME(templatesDir, outDir, { title });

  this.ask.forNPMInstall(outDir);
  await this.ask.forGitInit(outDir);
};
