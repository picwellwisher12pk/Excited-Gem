require('dotenv').config();
let webpack = require('webpack'),
  path = require('path'),
  LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
  fileSystem = require('fs'),
  Jarvis = require('webpack-jarvis'), //Browser based dashboard
  DashboardPlugin = require('webpack-dashboard/plugin'), //Webpack cli based dashboard
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin, //Bundle analyzer
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  Visualizer = require('webpack-visualizer-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin'),
  WebpackBar = require('webpackbar');

// load the secrets
alias = {};

let secretsPath = path.join(__dirname, 'secrets.' + process.env.NODE_ENV + '.js');

let images = ['jpg', 'jpeg', 'png', 'gif'];
let icons = ['svg'];
let fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];
let logoFile = (logoType = 'png') => {
  if (logoType === 'svg') return process.env.NODE_ENV === 'development' ? 'dev-logo.svg' : 'logo.svg';
  else return process.env.NODE_ENV === 'development' ? 'dev-logo.png' : 'logo.png';
};
let faviconFile = process.env.NODE_ENV === 'development' ? 'src/images/dev-logo.svg' : 'src/images/logo.svg';

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

exports.general = [
  {
    context: __dirname,
    entry: {
      tabs: [
        // "@babel/polyfill",
        path.join(__dirname, 'src', 'scripts', 'TabsApp.js'),
      ],
      sessions: [
        // "@babel/polyfill",
        path.join(__dirname, 'src', 'scripts', 'sessions-container.js'),
      ],
      background: path.join(__dirname, 'src', 'scripts', 'background.js'),
    },
    output: {
      path: path.join(__dirname, 'firefox'),
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: 'style-loader', // inject CSS to page
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS modules
            },
            {
              loader: 'postcss-loader', // Run post css actions
              options: {
                plugins: function () {
                  // post css plugins, can be exported to postcss.config.js
                  return [require('precss'), require('autoprefixer')];
                },
              },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
            },
          ],
        },
        {
          test: new RegExp('.(' + images.join('|') + ')$'),
          loader: 'file-loader?name=images/[name].[ext]',
          exclude: /node_modules/,
        },
        {
          test: new RegExp('.(' + icons.join('|') + ')$'),
          loader: 'file-loader?name=icons/[name].[ext]',
          exclude: /node_modules/,
        },
        // {
        //   test: new RegExp('.(' + fonts.join('|') + ')$'),
        //   loader: 'file-loader?name=/fonts/[name].[ext]',
        //   exclude: /node_modules/,
        // },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      alias: alias,
      extensions: fileExtensions.map(extension => '.' + extension).concat(['.jsx', '.js', '.css']),
      modules: ['path.resolve(__dirname, "src")', 'node_modules', path.resolve(__dirname, 'firefox')],
      descriptionFiles: ['package.json'],
      moduleExtensions: ['-loader'],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        React: 'react',
      }),
      new ExtractTextPlugin({
        filename: 'css/[name].css',
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),

      new HtmlWebpackPlugin({
        title: 'Excited Gem | Tabs',
        logotype: logoFile,
        template: path.join(__dirname, 'src', 'tabs.ejs'),
        filename: 'tabs.html',
        favicon: faviconFile,
        chunks: ['tabs'],
      }),
      new HtmlWebpackPlugin({
        title: 'Excited Gem | Sessions',
        logotype: logoFile,
        template: path.join(__dirname, 'src', 'sessions.ejs'),
        filename: 'sessions.html',
        favicon: faviconFile,
        chunks: ['sessions'],
      }),
      new WriteFilePlugin(), //Writes files to target directory during development build phase.
      new WebpackBar({profile: true}),
      new BundleAnalyzerPlugin({analyzerPort: 3030}),
      new Visualizer({filename: './statistics.html'}), //Pie
      new LodashModuleReplacementPlugin({collections: true}),
      // new DashboardPlugin(),//cli based dashboard
      new Jarvis({
        port: 1337, // optional: set a port
      }),
    ],
  },

  {devtool: 'eval-source-map'},
];
