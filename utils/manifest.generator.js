var manifest = require('../manifest_partials/common'),
  fileSystem = require('fs'),
  package = require('../package.json');
  path = require('path'),
  env = require('./env');
logofile = env.NODE_ENV == 'development' ? "images/dev-logo.png" : "images/logo.png";

// generates the manifest file using the package.json informations
manifest.name = package.title;
manifest.version = package.version;
manifest.manifest_version = 2;

manifest.description = package.description;
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
  default_title: package.title,
};



  var chromeManifest = require('../manifest_partials/chrome');
  manifest2 = {...manifest,...chromeManifest}
  fileSystem.writeFileSync(path.join(__dirname, '../dist/manifest.json'), JSON.stringify(manifest2));





