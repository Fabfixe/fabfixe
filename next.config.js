module.exports = {
  webpack(config) {
     config.node = { fs: 'empty' }
     return config
  },
  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 60
  }
}
