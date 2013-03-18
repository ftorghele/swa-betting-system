/*
 * Serve JSON to our AngularJS client
 */

var connection = require('../db.js'),
    appConfig = require('../config');

exports.games = function (req, res) {
  var sql = 'SELECT * FROM games WHERE endTime > NOW()';
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