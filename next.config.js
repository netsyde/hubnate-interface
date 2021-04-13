const path = require('path')
const withImages = require('next-images')

const withPWA = require('next-pwa')

// module.exports = withPWA({
//   pwa: {
//     dest: 'public'
//   }
// })

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
    config.resolve.alias['@types'] = path.resolve(__dirname, 'src/types')

    return config
  },
},
withPWA({
    pwa: {
      dest: 'public'
    }
  })
)

