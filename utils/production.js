const webpack = require('webpack');
const config = require('../webpack.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require('./prepare');

delete config.chromeExtensionBoilerplate;

config.general[0].plugins.push(
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new UglifyJsPlugin()
);

webpack(config.general[0], function (err) {
  if (err) throw err;
});
