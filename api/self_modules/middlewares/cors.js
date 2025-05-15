
require('dotenv').config();

var whitelist = [`http://${process.env.URL_API}:80`,
  `http://${process.env.URL_API}:8080`,
  `http://${process.env.URL_API}:3000`,
  `http://${process.env.URL_API}`,
  `http://${process.env.URL_API}:3001`]

module.exports = corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      let corsOption = {origin: true}
      callback(null, corsOption)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}