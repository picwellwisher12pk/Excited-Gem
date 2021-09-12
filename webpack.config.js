require("dotenv").config();
const autoprefixer = require("autoprefixer");
let webpack = require("webpack"),
  WebExtPlugin = require("web-ext-plugin"),
  path = require("path"),
  fileSystem = require("fs"),
  DashboardPlugin = require("webpack-dashboard/plugin"), //Webpack cli based dashboard
  BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin, //Bundle analyzer
  env = require("./utils/env"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  // ExtractTextPlugin = require("extract-text-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  ExtensionReloader = require("webpack-extension-reloader"),
  ChromeExtensionReloader = require("webpack-chrome-extension-reloader"),
  preCSS = require("precss"),
  WebpackBar = require("webpackbar"),
  CopyPlugin = require("copy-webpack-plugin");

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
    tabs: [path.resolve(__dirname, "src", "scripts", "TabsApp.js")],
    // sessions: [
    // "@babel/polyfill",
    //   path.resolve(__dirname, "src", "scripts", "sessions-container.js"),
    // ],
    background: [path.resolve(__dirname, "src", "scripts", "background.js")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(s?css)$/,
        exclude: /node_modules/,
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
              postcssOptions: {
                plugins: [preCSS],
              },
            },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: new RegExp(".(" + images.join("|") + ")$"),
        loader: "file-loader",
        options: {
          name: "images/[name].[ext]",
        },
        exclude: /node_modules/,
      },
      {
        test: new RegExp(".(" + fonts.join("|") + ")$"),
        loader: "file-loader",
        options: {
          name: "/fonts/[name].[ext]",
        },
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
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
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
      path.resolve(__dirname, "src/icons"),
    ],
    descriptionFiles: ["package.json"],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    devMiddleware: {
      index: true,
      mimeTypes: { "text/html": ["phtml"] },
      publicPath: "/publicPathForDevServe",
      serverSideRender: true,
      writeToDisk: true,
    },
  },
  plugins: [
    // new WebExtPlugin({
    //   sourceDir: path.resolve(__dirname, "dist"),
    //   browserConsole: true,
    // }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "scripts", "background.js"),
          to: path.resolve(__dirname, "dist"),
        },
        {
          from: path.resolve(__dirname, "src", "scripts", "background.js"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      React: "react",
    }),

    // new MiniCssExtractPlugin({
    //   filename: "css/[name].css",
    //   chunkFilename: "[id].css",
    // }),
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
    // env.NODE_ENV === "development" && new webpack.HotModuleReplacementPlugin(),
    // new ExtensionReloader(),
    new WebpackBar({ profile: true }),
    new BundleAnalyzerPlugin({ analyzerPort: 3030 }),
    // new LodashModuleReplacementPlugin({ collections: true }),
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
