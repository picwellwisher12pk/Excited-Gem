"use strict";

module.exports = {
  plugins: {
    tailwindcss: {},
    "postcss-preset-env": {
      browsers: "last 2 versions",
    },
    autoprefixer: {},
    "postcss-import": {},
    cssnano: {},
  },
};
