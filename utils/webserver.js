const WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    config = require("../webpack.config"),
    env = require("./env"),
    fileSystem = require("fs"),
    path = require("path");
const util = require('util');
require("./prepare");
//Firefox
if(env.browserClient === 'firefox' || env.browserClient === 'all'){
  var options = (config.firefoxConfig[0].chromeExtensionBoilerplate || {});
  var excludeEntriesToHotReload = (options.notHotReload || []);
  for (var entryName in config.firefoxConfig[0].entry) {
    if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
      config.firefoxConfig[0].entry[entryName] = [
        ("webpack-dev-server/client?http://localhost:" + env.PORT),
        "webpack/hot/dev-server"
      ].concat(config.firefoxConfig[0].entry[entryName]);
    }
  }
  config.firefoxConfig[0].plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.firefoxConfig[0].plugins || []);
  delete config.firefoxConfig.chromeExtensionBoilerplate;
  var compiler = webpack(config.firefoxConfig[0]);
  var firefoxServer = new WebpackDevServer(compiler, {
      hot: true,
      contentBase: path.join(__dirname, "../firefox"),
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  firefoxServer.listen(env.PORT+1);
}
//Chrome
if(env.browserClient === 'chrome' || env.browserClient === 'all'){
  var options = (config.chromeConfig.chromeExtensionBoilerplate || {});
  var excludeEntriesToHotReload = (options.notHotReload || []);
  for (var entryName in config.chromeConfig.entry) {
    if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
      config.chromeConfig.entry[entryName] = [
        ("webpack-dev-server/client?http://localhost:" + env.PORT),
        "webpack/hot/dev-server"
      ].concat(config.chromeConfig.entry[entryName]);
    }
  }
  config.chromeConfig.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.chromeConfig.plugins || []);
  delete config.chromeConfig.chromeExtensionBoilerplate;
  var compiler = webpack(config.chromeConfig);
  var chromeServer = new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, "../chrome"),
    headers: { "Access-Control-Allow-Origin": "*" }
  });
  chromeServer.listen(env.PORT);
}
