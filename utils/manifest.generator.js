var manifest = require('../manifest_partials/common'),
  fileSystem = require('fs'),
  path = require('path'),
  env = require('./env');
logofile = env.NODE_ENV == 'development' ? "images/dev-logo.svg" : "images/logo.svg";

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;
manifest.manifest_version = 2;
manifest.name = process.env.npm_package_title;
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
// manifest.sidebar_action= {
//   "default_title": "Excited Gem",
//     "default_panel": "tabs.html",
//     "default_icon": "logo.svg"
// };

if(env.browserClient === 'firefox'){
  var firefoxManifest = require('../manifest_partials/firefox');
  manifest = Object.assign({},manifest, firefoxManifest);;
  fileSystem.writeFileSync(path.join(__dirname, '../firefox/manifest.json'), JSON.stringify(manifest));
}else{
  var chromeManifest = require('../manifest_partials/chrome');
  // manifest = {manifest,...chromeManifest};
  fileSystem.writeFileSync(path.join(__dirname, '../chrome/manifest.json'), JSON.stringify(manifest));
}





