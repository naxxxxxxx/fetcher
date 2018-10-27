module.exports = typeof window === 'undefined' ? require('./lib/index.js') : require('./src/index.js')
