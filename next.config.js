const path = require('path')
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
]);