/*
 * Serve JSON to our AngularJS client
 */

var connection = require('../db.js'),
    rabbitCon = require('../rabbit.js');

exports.games = function (req, res) {
  var sql = 'SELECT * FROM games';
  connection.query(sql, function(err, result) {
    if (err) throw err;
    res.json({
      games: result
    });
  });
};

exports.addgame = function (req, res) {
  var sql = 'INSERT INTO games (title, description, quoteA, quoteB, quoteX, endTime) VALUES (' +
    connection.escape(req.body.title) + ',' + 
    connection.escape(req.body.description) + ',' + 
    connection.escape(req.body.quoteA) + ',' + 
    connection.escape(req.body.quoteB) + ',' +
    connection.escape(req.body.quoteX) + ',' +
    connection.escape(req.body.endTime) + ');'
  ;   
  
  connection.query(sql, function(err, result) {
    if (err) throw err;
  });
  
  res.json(req.body);
};

exports.addBet = function (req, res) {
  var bettingExchange;
  rabbitConn.on('ready', function() {
    bettingExchange = rabbitConn.exchange('bettingExchange', {'type': 'direct'});
  });

bettingExchange.publish('', data);
  
  rabbitConn.queue('', {exclusive: true}, function(q) {
		// Bind to chatExchange w/ "#" or "" binding key to listen to all messages
		q.bind('bettingExchange', "");

		// Subscribe when a message comes, send it back to browser
		/*q.subscribe(function (message) {
			socket.emit('msg', message);
		});*/
	});
  
  res.json(req.body);
}