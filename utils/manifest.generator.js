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
manifest.icons = {
  '128': logofile,
  '16': logofile,
  '48': logofile,
};
manifest.browser_action = {
  default_icon: {
    '19': logofile,
    '38': logofile,
  },
  default_title: process.env.npm_package_title,
};


if(env.browserClient === 'firefox'){
  var firefoxManifest = require('../manifest_partials/firefox');
  manifest = Object.assign({},manifest,firefoxManifest);
  fileSystem.writeFileSync(path.join(__dirname, '../firefox/manifest.json'), JSON.stringify(manifest));
}else{
  var chromeManifest = require('../manifest_partials/chrome');
  // manifest = {manifest,...chromeManifest};
  fileSystem.writeFileSync(path.join(__dirname, '../chrome/manifest.json'), JSON.stringify(manifest));
}





