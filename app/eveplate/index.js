const chalk = require('chalk');
const fs = require('fs');
const fsExtra = require('fs-extra');
const os = require('os');
const path = require('path');

const Generator = require('yeoman-generator');
const Utils = require('./utils');
const Ask = require('./ask');
const Create = require('./create');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.utils = new Utils();
        this.ask = new Ask(this);
        this.create = new Create(this);
        this.root = path.resolve(path.join(__dirname, '../', '../'));
    }

    async prompting() {
        const { version, description } = JSON.parse(fs.readFileSync(path.join(this.root, 'package.json'), 'utf8'));
        const choices = [];
        {
            const genDir = path.resolve(path.join(this.root, 'app/generators'));

            for (const item of await fsExtra.readdir(genDir)) {
                if (!item.endsWith('.js')) continue;

                const generatorFile = require.resolve(path.join(genDir, item));
                const { about = {}, run: value } = require(generatorFile);
                let { displayName: name } = about;

                name = this.utils.toStringSafe(name).trim();

                if (name === '') name = path.basename(generatorFile);

                choices.push({ name, value });
            }
        }

        process.stdout.write(`${chalk.reset()}`);
        process.stdout.write(`${chalk.white('eveplate ' + version)}${os.EOL}`);
        process.stdout.write(`${chalk.reset(description)}${os.EOL}`);
        process.stdout.write(`${os.EOL}${chalk.reset()}`);

        this.generators = await this.ask.forGenerators(choices);
    }

    async writing() {
        if (!this.generators) return;

        return await Promise.resolve(this.generators.apply(this, []));
    }
};