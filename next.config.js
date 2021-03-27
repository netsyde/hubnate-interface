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
  webpack: (config, options) => {
    console.log(config.resolve.alias)
    config.resolve.alias['@types'] = path.resolve(__dirname, 'src/types')

    return config
  },
})