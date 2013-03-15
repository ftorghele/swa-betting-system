var mongodb = amqp = require('amqp')
;

var rabbitmqConn;

function getRabbitMqConnection(callback) {
    var url = "amqp://guest:guest@localhost:5672";

    if (rabbitmqConn) {
        callback(rabbitmqConn);
    } else {
        console.log("Starting ... AMQP URL: " + url);
        var conn = amqp.createConnection({url: url});
        conn.on('ready', function() {
            rabbitmqConn = conn;
            callback(rabbitmqConn);
        });
        conn.on('closed', function() {
            rabbitmqConn = null;
        });
    }
}

exports.getRabbitMqConnection = getRabbitMqConnection;