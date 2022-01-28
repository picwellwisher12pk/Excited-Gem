"use strict";

// module.exports = (ctx) => ({
//   map: ctx.file.dirname.includes('examples') ? false : {
//     inline: false,
//     annotation: true,
//     sourcesContent: true
//   },
//   plugins: {
//     autoprefixer: {
//       cascade: false
//     }
//   }
// })
module.exports = {
  plugins: {
    "postcss-preset-env": {
      browsers: "last 2 versions",
    },
    autoprefixer: {},
    "postcss-import": {},
    precss: {},
    cssnano: {},
  },
};
