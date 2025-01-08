"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var zip_bundle_1 = require("./lib/zip-bundle");
// package the root dist file
(0, zip_bundle_1.zipBundle)({
    distDirectory: (0, node_path_1.resolve)(__dirname, '../../dist'),
    buildDirectory: (0, node_path_1.resolve)(__dirname, '../../dist-zip'),
    archiveName: process.env.__FIREFOX__ ? 'extension.xpi' : 'extension.zip',
});
