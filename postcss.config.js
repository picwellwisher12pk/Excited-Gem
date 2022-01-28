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
  plugins: [
    require("postcss-import"),
    require("autoprefixer"),
    require("postcss-preset-env"),
    require("precss"),
    require("cssnano"),
  ],
};
