const manifest = require("../manifest_partials/common"),
  fileSystem = require("fs"),
  myPackage = require("../package.json"),
  path = require("path"),
  env = require("./env"),
  logoFile =
    env.NODE_ENV === "development" ? "images/dev-logo.png" : "images/logo.png";

// generates the manifest file using the package.json informations
manifest.name = myPackage.title;
manifest.version = myPackage.version;
manifest.manifest_version = 2;

manifest.description = myPackage.description;
manifest.icons = {
  128: logoFile,
  16: logoFile,
  48: logoFile,
};
manifest.browser_action = {
  default_icon: {
    19: logoFile,
    38: logoFile,
  },
  default_title: myPackage.title,
};

const chromeManifest = require("../manifest_partials/chrome");
manifest2 = { ...manifest, ...chromeManifest };
fileSystem.writeFileSync(
  path.join(__dirname, "../dist/manifest.json"),
  JSON.stringify(manifest2)
);
