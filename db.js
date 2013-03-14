// MySQL
var mysql = require('mysql'),
    appConfig = require('./config');

var connection = mysql.createConnection({
      host     : appConfig.mysql.host,
      user     : appConfig.mysql.user,
      password : appConfig.mysql.password,
      port     : appConfig.mysql.port,
      database : appConfig.mysql.database
    });

module.exports = connection;