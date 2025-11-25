<<<<<<< HEAD
var manifest = require('../manifest_partials/common'),
  fileSystem = require('fs'),
  path = require('path'),
  env = require('./env');
logofile = env.NODE_ENV == 'development' ? "images/dev-logo.png" : "images/logo.png";

// generates the manifest file using the package.json informations
manifest.name = process.env.npm_package_title;
manifest.version = process.env.npm_package_version;
manifest.manifest_version = 2;

manifest.description = process.env.npm_package_description;
=======
const browserClient = "chrome";
const ext = browserClient === "firefox" ? ".svg" : ".png";
const chromeManifest = require("../manifest_partials/chrome");
const manifest = {},
  fileSystem = require("fs"),
  myPackage = require("../package.json"),
  path = require("path"),
  env = require("./env"),
  logoFile =
    env.NODE_ENV === "development"
      ? "images/dev-logo" + ext
      : "images/logo" + ext;

const getBackground =
  require("../manifest_partials/versionBasedMethods").getBackground;
const getPermissions =
  require("../manifest_partials/versionBasedMethods").getPermissions;
// generates the manifest file using the package.json information
manifest.name = myPackage.title;
manifest.version = myPackage.version;
manifest.manifest_version = 3;
manifest.background = getBackground(manifest.manifest_version);

manifest.description = myPackage.description;
>>>>>>> plasmo
manifest.icons = {
  128: logoFile,
  16: logoFile,
  48: logoFile,
};
manifest.action = {
  default_icon: {
    19: logoFile,
    38: logoFile,
  },
  default_title: myPackage.title,
};
<<<<<<< HEAD


if(env.browserClient === 'firefox'){
  var firefoxManifest = require('../manifest_partials/firefox');
  manifest = Object.assign({},manifest,firefoxManifest);
  fileSystem.writeFileSync(path.join(__dirname, '../firefox/manifest.json'), JSON.stringify(manifest));
}else{
  var chromeManifest = require('../manifest_partials/chrome');
  // manifest = {manifest,...chromeManifest};
  fileSystem.writeFileSync(path.join(__dirname, '../chrome/manifest.json'), JSON.stringify(manifest));
}



=======
>>>>>>> plasmo

const manifest2 = {
  ...manifest,
  ...getPermissions(manifest.manifest_version),
  ...chromeManifest,
};

fileSystem.writeFileSync(
  path.join(__dirname, "../dist/manifest.json"),
  JSON.stringify(manifest2)
);
