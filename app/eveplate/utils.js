const _ = require('lodash');
const minimatch = require('minimatch');
const { AllHtmlEntities } = require('html-entities');

class Utils {
    toStringsList(val) {
        return _.chain(val)
            .toArray()
            .map(p => this.toShortStr(p))
            .compact()
            .value();
    }

    doesMatch(val, patterns) {
        val = String(val);

        return this.toStringsList(patterns)
            .some(p => minimatch(val, p, { dot: true }));
    }

    encodeHtml(str) {
        return new AllHtmlEntities().encode(String(str));
    }

    sortObjectByKey(obj) {
        if (!obj) return obj;

        return _.chain(obj)
            .keys()
            .sortBy((key) => this.toSafeShortStr(key).toLowerCase())
            .reduce((a, i) => {
                a[i] = obj[i];
                return a
            }, {})
            .value();
    }

    toStr(val) {
        return _.toString(val)
    }

    toShortStr(str) {
        return String(str).trim();
    }

    toSafeShortStr(str) {
        return this.toStr(str).trim()
    }
}

module.exports = Utils;
