const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  path = require('path');
// const util = require('util');
require('./prepare');

var options = config.general[0].chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];
for (var entryName in config.general[0].entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.general[0].entry[entryName] = [
      'webpack-dev-server/client?http://' + require('os').hostname(),
      'webpack/hot/dev-server',
    ].concat(config.general[0].entry[entryName]);
  }
}
config.general[0].plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.general[0].plugins || []);
delete config.general.chromeExtensionBoilerplate;
var compiler = webpack(config.general[0]);
var firefoxServer = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../firefox'),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});
firefoxServer.listen(process.env.PORT);
