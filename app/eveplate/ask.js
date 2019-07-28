const sanitizeFilename = require('sanitize-filename');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

class Ask {
    constructor(context) {
        this.eveplate = context;
    }

    forNPMInstall(cwd) {
        this.eveplate.log(`Installing npm modules ...`);
        this.eveplate.spawnCommandSync('npm', ['install'], { cwd });
    }

    async confirm(message, opts = {}) {
        const confirmOpts = {
            type: 'confirm',
            name: 'confirm',
            message: this.eveplate.utils.toStringSafe(message),
            default: opts.default,
        };

        const { confirm } = await this.eveplate.prompt([confirmOpts]);

        return confirm;
    }

    async forGitInit(cwd) {
        const initOpts = {
            type: 'confirm',
            name: 'confirm',
            message: 'Run git init?',
            default: true
        };

        const { confirm } = await this.eveplate.prompt([initOpts]);
        if (!confirm) return false;

        this.eveplate.log(`Running 'git init' ...`);

        this.eveplate.spawnCommandSync('git', ['init'], { cwd });

        const originOpts = {
            type: 'input',
            name: 'git_origin',
            message: 'Add git remote (origin):',
        };

        const { git_origin } = await this.eveplate.prompt([originOpts]);
        const gitOrigin = String(git_origin).trim();

        if (gitOrigin !== '')
            this.eveplate.spawnCommandSync('git', ['remote', 'add', 'origin', gitOrigin], { cwd });

        return true;
    }

    async forPackageInfo() {
        const askAbout = async (item, opts) =>
            String(await this.promptString(`Enter a ${item.toUpperCase()} for your project:`, opts)).trim();

        let name = await askAbout('name', {
            default: '',
            validate: (val) => String(val).trim() !== ''
        });

        if (name === '') return false;

        let title = await askAbout('title', { default: name });

        if (title === '') title = name;

        name = name.toLowerCase();

        let description;
        description = await askAbout('description', { default: '' });
        description = this.eveplate.utils.toStringSafe(description);

        const mkDestinationDir = () => {
            const destDir = path.resolve(path.join(this.eveplate.destinationPath(sanitizeFilename(name))));

            if (fs.existsSync(destDir))
                throw new Error('[ERROR] directory already exists!');

            fs.mkdirSync(destDir);

            this.eveplate.log(`Created directory '${destDir}'.`);

            return destDir;
        };

        return { name, title, description, mkDestinationDir, };
    }

    async forGenerators(choices) {
        choices = _.sortBy(choices, ({ name }) => name.toLowerCase());

        const opts = {
            type: 'list',
            name: 'selected_generator',
            message: 'Please select a eveplate:',
            choices,
        };

        const { selected_generator } = await this.eveplate.prompt([opts]);
        return selected_generator;
    }

    async promptMultiSelect(message, items) {
        const opts = {
            type: 'checkbox',
            name: 'checked_items',
            message: this.eveplate.utils.toStringSafe(message),
            choices: items,
        };

        const { checked_items } = await this.eveplate.prompt([opts]);
        return checked_items;
    }

    async promptString(message, opts = {}) {
        let { validator } = opts;

        if (validator && validator === true) {
            validator = (val) => this.eveplate.utils.toStringSafe(val).trim() !== '';
        }

        let defaultValue = this.eveplate.utils.toStringSafe(opts.default);

        const promptOpts = {
            type: 'input',
            name: 'value',
            message: this.eveplate.utils.toStringSafe(message),
            validate: validator
        };

        if (defaultValue !== '') promptOpts.default = defaultValue;

        const { value } = await this.eveplate.prompt([promptOpts]);
        return value;
    }
}

module.exports = Ask;