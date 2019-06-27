const webpack = require('webpack');
const config = require('../webpack.config');
const env = require('./env');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require('./prepare');

console.log(config);
delete config.chromeExtensionBoilerplate;
console.log(env.browserClient);

if (process.env.NODE_ENV === 'production') {
  config.firefoxConfig[0].plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new UglifyJsPlugin()
  );
}
if (process.env.browserClient === 'chrome' || process.env.browserClient === 'all') {
  webpack(config.chromeConfig[0], function(err) {
    if (err) throw err;
  });
}
if (process.env.browserClient === 'firefox' || process.env.browserClient === 'all') {
  console.log('production firefox building');
  webpack(config.firefoxConfig[0], function(err) {
    if (err) throw err;
  });
}
