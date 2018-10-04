'use strict'

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
  parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {},
    'cssnano': {}
  }
};

