const path = require('path')
// const withImages = require('next-images')
const { i18n } = require('./src/next-i18next.config')

const withPWA = require('next-pwa')

const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    /* config for next-optimized-images */
  }],
  [withPWA,
    {
      pwa: {
        disable: process.env.NODE_ENV === 'development'
      }
    }
  ],
  {
    i18n
  },
  // your other plugins here

]);

// module.exports = {
//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en', 'de'],
//   }
// }
// module.exports = withImages({
//   assetPrefix: '',
//   distDir: 'dist',
//   generateEtags: false3,
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//   },
//   pageExtensions: ['tsx', 'ts'],
//   telemetry: false,
//   webpack: (config, options) => {
//     config.resolve.alias['@types'] = path.resolve(__dirname, 'src/types')

//     return config
//   }
// },
// withPWA({
//     pwa: {
//       dest: 'public'
//     }
//   }),
//   i18n
// )

