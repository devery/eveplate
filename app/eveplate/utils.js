const _ = require('lodash');
const minimatch = require('minimatch');
const { AllHtmlEntities } = require('html-entities');

class Utils {
    toStringsList(val) {
        return _.chain(val)
            .toArray()
            .map(p => String(p).trim())
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
            .sortBy((key) =>
                this.toStringSafe(key).toLowerCase().trim())
            .reduce((a, i) => {
                a[i] = obj[i];
                return a
            }, {})
            .value();
    }

    toStringSafe(val, defaultValue = '') {
        return _.toString(val) || String(defaultValue)
    }
}

module.exports = Utils;
