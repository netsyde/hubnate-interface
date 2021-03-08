const path = require('path')

module.exports = {
  assetPrefix: '',
  distDir: 'dist',
  generateEtags: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  pageExtensions: ['tsx', 'ts'],
  telemetry: false
}