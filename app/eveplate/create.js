const ejs = require('ejs');
const fs = require('fs');
const fsExtra = require('fs-extra');
const ora = require('ora');
const path = require('path');

class Create {
    constructor(context) {
        this.eveplate = context;
    }

    async withSpinner(opts, cb) {
        const spinner = new ora(opts);

        spinner.start();

        try {
            return await Promise.resolve(cb(spinner));
        } finally {
            spinner.stop();
        }
    }

    file(file, cb) {
        return this.withSpinner(
            `Generating '${file}' ...`,
            async (spinner) => {
                try {
                    const result = await Promise.resolve(cb(spinner));

                    spinner.succeed(`File '${file}' generated.`);

                    return result;
                } catch (e) {
                    spinner.fail(`Could not generate file '${file}': ${this.eveplate.utils.toStringSafe(e)}`);

                    process.exit(1);
                }
            }
        );
    };

    gitIgnore(outDir, entries) {
        this.eveplate.log(`Creating '.gitignore' ...`);

        fs.writeFileSync(`${String(outDir)}/.gitignore`, entries.join("\n"), 'utf8');
    }


    env(outDir, values) {
        this.eveplate.log(`Creating '.env' ...`);

        const lines = [];
        for (const key in values) {
            lines.push(`${String(key).toUpperCase().trim()}=${String(values[key])}`);
        }
        lines.push('');

        fs.writeFileSync(`${String(outDir)}/.env`, lines.join("\n"), 'utf8');
    }


    copy(from, to, patterns, excludes) {
        this.eveplate.log(`Copying files to '${to}' ...`);

        this.copyInner(from, to, { excludes, patterns, 'path': '/' });
    }

    copyInner(from, to, { patterns, path: _path, excludes }) {
        from = path.resolve(from);
        to = path.resolve(to);

        const includePatterns = this.eveplate.utils
            .toStringsList(patterns);

        if (includePatterns.length < 1) {
            includePatterns.push('**');
        }

        for (const item of fsExtra.readdirSync(from)) {
            const fromItem = path.resolve(path.join(from, item));
            const stat = fsExtra.statSync(fromItem);
            const fromItemsRelative = [`${_path}${item}`];

            fromItemsRelative.push(fromItemsRelative[0].substr(1));

            if (stat.isDirectory()) {
                fromItemsRelative.push(`${fromItemsRelative[0]}/`);
                fromItemsRelative.push(`${fromItemsRelative[1].substr(1)}/`);
            }

            const toItem = path.resolve(path.join(to, item));

            if (stat.isDirectory()) {
                this.copyInner(fromItem, toItem, { excludes, patterns, 'path': `${_path}${item}/`, });
            } else {
                if (fromItemsRelative.some(x => this.eveplate.utils.doesMatch(x, excludes))) continue;
                if (!fromItemsRelative.some(x => this.eveplate.utils.doesMatch(x, includePatterns))) continue;

                const targetDir = path.dirname(toItem);

                if (!fsExtra.existsSync(targetDir)) fsExtra.mkdirsSync(targetDir);

                fsExtra.copySync(fromItem, toItem);
            }
        }
    }

    copyREADME(from, to, data) {
        this.eveplate.log(`Setting up 'README.md' ...`);

        fs.writeFileSync(`${to}/README.md`, ejs.render(fs.readFileSync(`${from}/README.md`, 'utf8'), data), 'utf8');
    }
}

module.exports = Create;