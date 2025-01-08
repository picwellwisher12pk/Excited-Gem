"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestParserImpl = void 0;
exports.ManifestParserImpl = {
    convertManifestToString: function (manifest, env) {
        if (env === 'firefox') {
            manifest = convertToFirefoxCompatibleManifest(manifest);
        }
        return JSON.stringify(manifest, null, 2);
    },
};
function convertToFirefoxCompatibleManifest(manifest) {
    var _a;
    var manifestCopy = __assign({}, manifest);
    manifestCopy.background = {
        scripts: [(_a = manifest.background) === null || _a === void 0 ? void 0 : _a.service_worker],
        type: 'module',
    };
    manifestCopy.options_ui = {
        page: manifest.options_page,
        browser_style: false,
    };
    manifestCopy.content_security_policy = {
        extension_pages: "script-src 'self'; object-src 'self'",
    };
    manifestCopy.browser_specific_settings = {
        gecko: {
            id: 'example@example.com',
            strict_min_version: '109.0',
        },
    };
    delete manifestCopy.options_page;
    return manifestCopy;
}
