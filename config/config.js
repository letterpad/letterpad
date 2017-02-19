const env = {
    common: {
        "CLIENTPORT": 4040,
        "APIPORT": 3030
    },
    production: {
        "NODE_ENV": "production",
        "APIHOST": "api.cliptales.com",
        "CLIENTHOST": "cliptales.com"
    },
    development: {
        "NODE_ENV": "dev",
        "APIHOST": "localhost"
    }

}
var config = {};
config.clientPort = env.common.CLIENTPORT
config.apiPort = env.common.APIPORT

//check if this file is being read from client
if (typeof __CONFIG__ !== 'undefined') {
    config.apiUrl = __CONFIG__.apiUrl
    config.clientUrl = __CONFIG__.clientUrl
} else {
    if (process.env.NODE_ENV == 'dev') {
        config.apiUrl = 'http://'+env.development.APIHOST+':'+env.common.APIPORT
        config.clientUrl = 'http://'+env.development.APIHOST+':'+env.common.CLIENTPORT
    } else {
        config.apiUrl = 'http://'+env.production.APIHOST
        config.clientUrl = 'http://'+env.production.CLIENTHOST
    }
}
module.exports = config;