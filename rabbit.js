// MySQL
var amqp = require('amqp');

var rabbitConn = amqp.createConnection({});

module.exports = rabbitConn;