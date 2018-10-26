const webpack = require("webpack");
const config = require("../webpack.config");
const env = require("./env");
require("./prepare");

console.log(config);
delete config.chromeExtensionBoilerplate;
console.log(env.browserClient);
if (env.browserClient === 'chrome' || env.browserClient === 'all'){
  webpack(
    config.chromeConfig[0],
    function (err) { if (err) throw err; }
  );
}
if (env.browserClient === 'firefox' || env.browserClient === 'all'){
  console.log("production firefox building");
  webpack(
    config.firefoxConfig[0],
    function (err) { if (err) throw err; }
  );
}
