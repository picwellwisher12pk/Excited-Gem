const path = require('path'),
  webpack = require('webpack'),
  fileSystem = require('fs'),
  // env = require('./utils/env'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('mini-css-extract-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin'),
  Visualizer = require('webpack-visualizer-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// WebpackBar = require('webpackbar');
alias = {};
const images = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
const fonts = ['eot', 'otf', 'ttf', 'woff', 'woff2'];
const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];
console.log(path.join(__dirname, 'src', 'scripts', 'active-tabs-container.js'));
module.exports = {
  mode: 'development', // enabled useful tools for development
  entry: {
    tab: path.join(__dirname, 'src', 'scripts', 'active-tabs-container.js'),
    // background: path.join(__dirname, 'src', 'scripts', 'background.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/[name].js',
    chunkFilename: 'js/common.js',
    pathinfo: true, // boolean
    devtoolLineToLine: {
      test: /\.jsx$/,
    },
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [path.join(__dirname, 'src', 'scripts')],
        loader: 'babel-loader',
        options: {
          presets: ['stage-3', 'env', 'react'],
          plugins: ['dynamic-import-webpack'],
        },
      },
      {
        test: /\.scss$/,
        use: [ExtractTextPlugin.loader, 'css-loader', 'sass-loader'],
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
    ],
  },

  // resolve: {
  //   modules: [
  //     path.resolve(__dirname, 'node_modules'),
  //     // path.resolve(__dirname, 'src'),
  //     path.resolve(__dirname, 'build'),
  //   ],

  //   extensions: ['.js', '.json', '.jsx', '.css', 'scss'],

  //   alias: alias,
  //   descriptionFiles: ['package.json'],
  // },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),

    new HtmlWebpackPlugin({
      title: 'Excited Gem | Tabs',
      template: path.join(__dirname, 'build', 'tabs.ejs'),
      filename: 'tabs.html',
      // favicon: 'src/images/logo.svg',
      chunks: ['tabs'],
    }),
    new BundleAnalyzerPlugin(),
    new Visualizer(),
    new WriteFilePlugin(), //Writes files to target directory during development build phase.
  ],

  devtool: 'cheap-module-source-map', // cheap-variant of SourceMap with module mappings
  context: __dirname, // string (absolute path!)
  target: 'web', // enum
  stats: {
    //object
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },
};
