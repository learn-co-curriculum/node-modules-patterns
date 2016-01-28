if (process.env.NODE_ENV == 'production') {
  var configs = require('./configs-production')
} else if (process.env.NODE_ENV == 'testing) {
  var configs = require('./configs-testing')
} else { // Assume development
  var configs = require('./configs')
}

console.log('URL is %s', configs.url)
