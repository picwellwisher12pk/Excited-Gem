require("dotenv").config();
let webpack = require("webpack"),
  path = require("path"),
  LodashModuleReplacementPlugin = require("lodash-webpack-plugin"),
  fileSystem = require("fs"),
  DashboardPlugin = require("webpack-dashboard/plugin"), //Webpack cli based dashboard
  //BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin, //Bundle analyzer
  env = require("./utils/env"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  // ExtractTextPlugin = require("extract-text-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  // Visualizer = require("webpack-visualizer-plugin"),
  WriteFilePlugin = require("write-file-webpack-plugin"),
  ChromeExtensionReloader = require("webpack-chrome-extension-reloader"),
  WebpackBar = require("webpackbar");

require("./utils/prepare");

// Get the root path (assuming your webpack config is in the root of your project!)
// const currentPath = path.join(__dirname);

// Create the fallback path (the production .env)
// const basePath = currentPath + "/.env";

// We're concatenating the environment name to our filename to specify the correct env file!
// const envPath = basePath + "." + process.env.NODE_ENV;

// Check if the file exists, otherwise fall back to the production .env
// const finalPath = fileSystem.existsSync(envPath) ? envPath : basePath;

// Set the path parameter in the dotenv config
// const env = dotenv.config({ path: finalPath }).parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// load the secrets
alias = {};

let secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js");

let images = ["jpg", "jpeg", "png", "gif"];
// let icons = ["svg"];
let fonts = ["eot", "otf", "ttf", "woff", "woff2"];
let fileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "eot",
  "otf",
  "svg",
  "ttf",
  "woff",
  "woff2",
];
// let logoFile = (logoType = "png") => {
//   if (logoType === "svg")
//     return process.env.NODE_ENV === "development" ? "dev-logo.png" : "logo.png";
//   else
//     return process.env.NODE_ENV === "development" ? "dev-logo.png" : "logo.png";
// };
// let faviconFile =
//   process.env.NODE_ENV === "development"
//     ? "src/images/dev-logo.png"
//     : "src/images/logo.png";

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

// console.log(path.resolve(__dirname, "src", "scripts", "TabsApp.js"));
module.exports = {
  mode: "development",
  context: __dirname,
  entry: {
    tabs: [
      "@babel/polyfill",
      path.resolve(__dirname, "src", "scripts", "TabsApp.js"),
    ],
    // sessions: [
    // "@babel/polyfill",
    //   path.resolve(__dirname, "src", "scripts", "sessions-container.js"),
    // ],
    background: [
      "@babel/polyfill",
      path.resolve(__dirname, "src", "scripts", "background.js"),
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(s?css)$/,
        use: [
          {
            loader: "style-loader", // inject CSS to page
          },
          {
            loader: "css-loader", // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              plugins: function () {
                // post css plugins, can be exported to postcss.config.js
                return [require("precss"), require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
      {
        test: new RegExp(".(" + images.join("|") + ")$"),
        loader: "file-loader?name=images/[name].[ext]",
        // options:{esModule:false},
        exclude: /node_modules/,
      },
      {
        test: new RegExp(".(" + fonts.join("|") + ")$"),
        loader: "file-loader?name=/fonts/[name].[ext]",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults",
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => "." + extension)
      .concat([".jsx", ".js", ".css"]),
    modules: [
      'path.resolve(__dirname, "./src")',
      "node_modules",
      path.resolve(__dirname, "dist"),
    ],
    descriptionFiles: ["package.json"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      React: "react",
    }),

    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin(envKeys),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      NODE_ENV: JSON.stringify(env.NODE_ENV),
    }),

    new HtmlWebpackPlugin({
      title: "Excited Gem | Tabs",
      logotype: env.NODE_ENV === "development" ? "dev-logo.png" : "logo.png",
      template: path.join(__dirname, "./src", "tabs.ejs"),
      filename: "tabs.html",
      favicon:
        env.NODE_ENV === "development"
          ? "./src/images/dev-logo.png"
          : "./src/images/logo.png",
      chunks: ["tabs"],
    }),
    new HtmlWebpackPlugin({
      title: "Excited Gem | Sessions",
      logotype: env.NODE_ENV === "development" ? "dev-logo.png" : "logo.png",
      template: path.join(__dirname, "./src", "sessions.ejs"),
      filename: "sessions.html",
      favicon:
        env.NODE_ENV === "development"
          ? "./src/images/dev-logo.png"
          : "./src/images/logo.png",
      chunks: ["sessions"],
    }),
    env.NODE_ENV === "development" && new webpack.HotModuleReplacementPlugin(),
    new ChromeExtensionReloader(),
    new WriteFilePlugin(), //Writes files to target directory during development build phase.
    new WebpackBar({profile: true}),
    // new BundleAnalyzerPlugin({ analyzerPort: 3030 }),
    // new Visualizer({ filename: "./statistics.html" }), //Pie
    new LodashModuleReplacementPlugin({collections: true}),
    new DashboardPlugin(), //cli based dashboard
  ],

  /*    {
        entry: path.join(__dirname, 'src', 'manifest.json'),
        output: {
            path: path.join(__dirname, 'firefox'),
          filename: '[name].json',
        },
      },*/

  devtool: env.NODE_ENV === "development" ? "source-map" : "cheap-source-map",
};
