const path = require('path')
const withImages = require('next-images')

module.exports = withImages({
  assetPrefix: '',
  distDir: 'dist',
  generateEtags: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  pageExtensions: ['tsx', 'ts'],
  telemetry: false,
})