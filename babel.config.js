module.exports = function (api) {
  api.cache(true);

  const presets = [ ["@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }],
    "@babel/preset-react", ];

  const plugins = [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-json-strings",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "babel-preset-react-hot"
        // "@babel/plugin-transform-spread",

   ];

  return {
    presets,
    plugins
  };
}
