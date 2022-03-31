// require("dotenv").config();
// const autoprefixer = require("autoprefixer");
const webpack = require("webpack"),
  path = require("path"),
  fileSystem = require("fs"),
  env = require("./utils/env"),
  WebExtPlugin = require("web-ext-plugin"),
  DashboardPlugin = require("webpack-dashboard/plugin"), //Webpack cli based dashboard
  BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin, //Bundle analyzer
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  WebpackBar = require("webpackbar"),
  CopyPlugin = require("copy-webpack-plugin");
// ExtractTextPlugin = require("extract-text-webpack-plugin"),
// Visualizer = require("webpack-visualizer-plugin"),
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const paths = require("./paths.js");
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
alias = { "@": paths.src };

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
    "excited-gem": [path.resolve(__dirname, "src", "scripts", "app.js")],
    background: [path.resolve(__dirname, "src", "scripts", "background.js")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } },
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
    alias,
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
    hot: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
      staticOptions: {},
      // Don't be confused with `devMiddleware.publicPath`, it is `publicPath` for static directory
      // Can be:
      // publicPath: ['/static-public-path-one/', '/static-public-path-two/'],
      publicPath: "/dist",
      // Can be:
      // serveIndex: {} (options for the `serveIndex` option you can find https://github.com/expressjs/serve-index)
      serveIndex: true,
      // Can be:
      // watch: {} (options for the `watch` option you can find https://github.com/paulmillr/chokidar)
      watch: true,
    },
    devMiddleware: {
      index: true,
      mimeTypes: { "text/html": ["phtml"] },
      publicPath: "/dist",
      serverSideRender: true,
      writeToDisk: true,
    },
    client: {
      webSocketURL: {
        hostname: "0.0.0.0",
        pathname: "/ws",
        port: 8080,
      },
      logging: "info",
      // Can be used only for `errors`/`warnings`
      //
      overlay: {
        errors: true,
        warnings: true,
      },
      // overlay: true,
      progress: true,
      webSocketTransport: "ws",
    },
    webSocketServer: "ws",
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
      ],
    }),
    new webpack.ProvidePlugin({
      // $: "jquery",
      // jQuery: "jquery",
      React: "react",
    }),

    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[id].css",
      linkType: "text/css",
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
      template: path.join(__dirname, "./src", "excited-gem.ejs"),
      filename: "excited-gem.html",
      favicon:
        env.NODE_ENV === "development"
          ? "./src/images/dev-logo.png"
          : "./src/images/logo.png",
      chunks: ["excited-gem"],
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
    // new LodashModuleReplacementPlugin({ collections: true }),

    new WebpackBar({ profile: true }),

    // new BundleAnalyzerPlugin({ analyzerPort: 3030 }),

    // new Visualizer({ filename: "./statistics.html" }), //Pie

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
