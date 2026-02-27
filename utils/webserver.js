const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path')
// const util = require('util');
require('./prepare')

var options = config.chromeExtensionBoilerplate || {}
var excludeEntriesToHotReload = options.notHotReload || []

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server'
    ].concat(config.entry[entryName])
    console.log('entries urls: ', config.entry)
  }
}
config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
)
delete config.chromeExtensionBoilerplate

var compiler = webpack(config)
var server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.resolve(__dirname, '../dist'),
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Headers":
  //     "Origin, X-Requested-With, Content-Type, Accept",
  // },
  sockHost: '192.168.10.5',
  // useLocalIp: true,
  sockPort: 8080
  // disableHostCheck: true
})
server.listen(env.PORT)
