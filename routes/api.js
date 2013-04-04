/*
 * Serve JSON to our AngularJS client
 */

require('datejs');

var connection = require('../db.js'),
    rabbit = require('../lib/rabbit'),
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
    connection.escape(new Date().add({ minutes: req.body.endTime })) + ');'
  ;   
  
  connection.query(sql, function(err, result) {
    if (err) throw err;
  });
  
  res.json(req.body);
};

exports.addbet = function (req, res) {
  var quote = 0;
  
  if(req.body.tip == 'quoteA') {
    quote = req.body.game.quoteA;
  } else if (req.body.tip == 'quoteB') {
    quote = req.body.game.quoteB;
  } else {
    quote = req.body.game.quoteX;
  }
  
  console.log(quote);
  
  var sql = 'INSERT INTO bets (id_user, id_game, amount, quote, tip) VALUES (' +
    connection.escape(req.user.id) + ',' + 
    connection.escape(req.body.game.id) + ',' + 
    connection.escape(req.body.amount) + ',' + 
    connection.escape(quote) + ',' +
    connection.escape(req.body.tip) + ');'
  ;   
  
  connection.query(sql, function(err, result) {
    if (err) throw err;
    var sql_amount = 'UPDATE users SET credits = credits - ' +
      req.body.amount + ' WHERE id = ' +
      req.user.id;
    connection.query(sql_amount, function(err, result) {
      if (err) throw err;
      rabbit.odds(req.body);
    });
  });
  
  res.json(req.body);
};