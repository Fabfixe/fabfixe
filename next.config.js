const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
module.exports = withSass(withCSS(
  {
    webpack(config) {
       config.node = { fs: 'empty' }
       return config
    },
    onDemandEntries: {
      // Make sure entries are not getting disposed.
      maxInactiveAge: 1000 * 60 * 60
    }
  }
))
