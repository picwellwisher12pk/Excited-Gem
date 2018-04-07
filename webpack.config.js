let webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs'),
  env = require('./utils/env'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin'),
  WebpackBar = require('webpackbar');

// load the secrets
alias = {};

let secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

let images = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
let fonts = ['eot', 'otf', 'ttf', 'woff', 'woff2'];
let fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

let options = {
  context: __dirname,
  entry: {
    tabs: path.join(__dirname, 'src', 'scripts', 'active-tabs-container.js'),
    options: path.join(__dirname, 'src', 'scripts', 'options-container.js'),
    sessions: path.join(__dirname, 'src', 'scripts', 'sessions-container.js'),
    background: path.join(__dirname, 'src', 'scripts', 'background.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
        exclude: /node_modules/,
      },
      {
        test: new RegExp('.(' + images.join('|') + ')$'),
        loader: 'file-loader?name=images/[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: new RegExp('.(' + fonts.join('|') + ')$'),
        loader: 'file-loader?name=/fonts/[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['stage-3', 'env', 'react'],
        },
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions.map(extension => '.' + extension).concat(['.jsx', '.js', '.css']),
    modules: ['node_modules', path.resolve(__dirname, 'src'), path.resolve(__dirname, 'build')],
    descriptionFiles: ['package.json'],
    moduleExtensions: ['-loader'],
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      CLIENT: process.env.CLIENT || 'browser',
    }),

    new HtmlWebpackPlugin({
      title: 'Excited Gem | Tabs',
      template: path.join(__dirname, 'src', 'tabs.ejs'),
      filename: 'tabs.html',
      favicon: 'src/images/logo.svg',
      chunks: ['tabs'],
    }),

    new HtmlWebpackPlugin({
      title: 'Excited Gem | Options',
      template: path.join(__dirname, 'src', 'options.ejs'),
      favicon: 'src/images/logo.svg',
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      title: 'Excited Gem | Sessions',
      template: path.join(__dirname, 'src', 'sessions.ejs'),
      favicon: 'src/images/logo.svg',
      filename: 'sessions.html',
      chunks: ['sessions'],
    }),
    new WriteFilePlugin(), //Writes files to target directory during development build phase.
    new WebpackBar({ profile: true }),
  ],
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}
options.devtool = 'cheap-source-map';

module.exports = options;
