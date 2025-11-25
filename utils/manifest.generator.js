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

const manifest2 = {
  ...manifest,
  ...getPermissions(manifest.manifest_version),
  ...chromeManifest,
};

fileSystem.writeFileSync(
  path.join(__dirname, "../dist/manifest.json"),
  JSON.stringify(manifest2)
);
