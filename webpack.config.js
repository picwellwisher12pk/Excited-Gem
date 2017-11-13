var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    webpackValidator = require('webpack-validator'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var images = ["jpg", "jpeg", "png", "gif", "svg"];
var fonts = ["eot", "otf", "ttf", "woff", "woff2"];
var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}

var options = {
    context: __dirname,
    entry: {
        tabs: path.join(__dirname, "src", "scripts", "app.jsx"),
        options: path.join(__dirname, "src", "scripts", "components", "options.jsx"),
        sessions: path.join(__dirname, "src", "scripts", "sessions.jsx"),
        background: path.join(__dirname, "src", "scripts", "background.jsx")
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "js/[name].js"
    },
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     loader: "file-loader!css-loader",
            //     options: {
            //         outputPath: "css/"
            //     },
            //     exclude: /node_modules/
            // },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
                exclude: /node_modules/
            },
            {
                test: new RegExp('\.(' + images.join('|') + ')$'),
                loader: "file-loader?name=images/[name].[ext]",
                exclude: /node_modules/
            },
            {
                test: new RegExp('\.(' + fonts.join('|') + ')$'),
                loader: "file-loader?name=/fonts/[name].[ext]",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: alias,
        extensions: fileExtensions.map(extension => ("." + extension)).concat([".jsx", ".js", ".css"]),
        modules: [path.resolve(__dirname, 'src'), 'node_modules', path.resolve(__dirname, 'build')],
        descriptionFiles: ['package.json'],
        moduleExtensions: ['-loader'],
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new ExtractTextPlugin({
            filename: "css/[name].css"
        }),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
        }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, "src", "tabs.html"),
        //     filename: "tabs.html",
        //     chunks: ["tabs"]
        // }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "tabs.html"),
            filename: "tabs.html",
            chunks: ["tabs"]
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "sessions.html"),
            filename: "sessions.html",
            chunks: ["sessions"]
        }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, "src", "background.html"),
        //     filename: "background.html",
        //     chunks: ["background"]
        // }),

        new WriteFilePlugin()
    ]
};

// if (env.NODE_ENV === "development") {
//     options.devtool = "cheap-module-eval-source-map";
// }
options.devtool = "cheap-source-map";

module.exports = options;