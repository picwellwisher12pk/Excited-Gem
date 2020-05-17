const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  path = require('path');
// const util = require('util');
require('./prepare');


config.modules.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.modules.plugins || []);
// delete config.chromeExtensionBoilerplate;
var compiler = webpack(config.modules);
var server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.resolve(__dirname, '../firefox'),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});
server.listen(process.env.PORT);
