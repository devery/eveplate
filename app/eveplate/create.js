const ejs = require('ejs');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

class Create {
    constructor(context) {
        this.eveplate = context;
    }

    fromSource(from, to, data) {
        return ([source]) => {
            const net = source.substr(0, source.lastIndexOf('.'));
            this.eveplate.log(`... Setting up '${net}'`);

            try {
                const compiled = ejs.render(fs.readFileSync(`${from}/${source}`, 'utf8'), data);

                fs.writeFileSync(`${to}/${net}`, compiled, 'utf8');
            } catch (e) {
                throw new Error(`[ERROR] Could not generate file '${source}': ${this.eveplate.utils.toStr(e)}`);
            }
        };
    }

    packageJson(from, to, data) {
        this.fromSource(from, to, data)`package.json.ejs`;
    }

    indexHTML(from, to, data) {
        this.fromSource(from, to, data)`index.html.ejs`;
    }

    README(from, to, data) {
        this.fromSource(from, to, data)`README.md.ejs`;
    }

    fromData(to, data) {
        return ([source]) => {
            this.eveplate.log(`... Creating '${source}'`);

            fs.writeFileSync(`${String(to)}/${source}`, data.join("\n"), 'utf8');
        }
    }

    gitIgnore(outDir, values) {
        this.fromData(outDir, values)`.gitignore`;
    }

    env(outDir, values) {
        const lines = [];
        for (const key in values) {
            if (!values.hasOwnProperty(key)) continue;

            lines.push(`${this.eveplate.utils.toSafeShortStr(key).toUpperCase()}=${String(values[key])}`);
        }
        lines.push('');

        this.fromData(outDir, lines)`.env`;
    }

    copy(from, to, patterns, excludes) {
        this.eveplate.log(`... Copying files to '${to}'`);

        this.copyInner(from, to, { excludes, patterns, 'path': '/' });
    }

    copyInner(from, to, { patterns, path: _path, excludes }) {
        from = path.resolve(from);
        to = path.resolve(to);

        const includePatterns = this.eveplate.utils.toStringsList(patterns);

        if (includePatterns.length < 1) includePatterns.push('**');

        for (const item of fsExtra.readdirSync(from)) {
            const toItem = path.resolve(path.join(to, item));
            const fromItem = path.resolve(path.join(from, item));
            const stat = fsExtra.statSync(fromItem);
            const fromItemsRelative = [`${_path}${item}`];

            fromItemsRelative.push(fromItemsRelative[0].substr(1));

            if (stat.isDirectory()) {
                fromItemsRelative.push(`${fromItemsRelative[0]}/`);
                fromItemsRelative.push(`${fromItemsRelative[1].substr(1)}/`);

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
}

module.exports = Create;