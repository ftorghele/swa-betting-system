/*
 * Serve JSON to our AngularJS client
 */

var connection = require('../db.js');

exports.name = function (req, res) {
  res.json({
  	name: 'bob'
  });
};

exports.games = function (req, res) {
  var sql = 'SELECT * FROM games';
  connection.query(sql, function(err, result) {
    if (err) throw err;
    res.json({
      games: result
    });
  });
};