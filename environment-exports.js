exports = function(env) {
  env = env || process.env.NODE_ENV
  if (env == 'production') {
    return {
      url: 'http://webapplog.com',
      name: 'React Quicly',
      port: 3000,
      apiKey: "34EC5CE9-CD02-4C4E-B5D9-D7CEF2F12F2C"
    }
  } else if (env == 'testing') {
    return {
      url: 'http://webapplog.com',
      name: 'React Quicly',
      port: 3000,
      apiKey: "D2230FC4-7E2A-4003-9372-0BF80107558D"
    }
  } else { // Assume development
    return {
      url: 'http://webapplog.com',
      name: 'React Quicly',
      port: 3000,
      apiKey: "D1FCFE58-575F-40FF-AF36-0CBD6A367756"
    }
  }
}
