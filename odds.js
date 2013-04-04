/**
 * Module dependencies.
 */

var appConfig = require('./config'),
  services = require('./lib/services.js'),
  connection = require('./db.js');

function setup(conn) {
  var queue = conn.queue('odds_queue', {durable: false}, function() {
    
    queue.subscribe(function(msg) {
      
      var sql = 'SELECT SUM(amount) as total FROM bets WHERE id_game = ' + 
        connection.escape(msg.body.id_game);
      connection.query(sql, function(err, result) {
        if (err) throw err;

        var quota = msg.body.amount / (result[0].total + msg.body.amount);
        var incr = 0;
        var decr = 0;        
        
        if(quota > 0.5) {
          incr = 1.5;
          decr = 0.5;
        } else if (quota > 0.4) {
          incr = 1.4;
          decr = 0.4;
        } else if (quota > 0.3) {
          incr = 1.3;
          decr = 0.3;
        } else if (quota > 0.2) {
          incr = 1.2;
          decr = 0.2;
        } else if (quota > 0) {
          incr = 1.1;
          decr = 0.1;
        }

        var sql_game = 'SELECT * FROM games WHERE id = ' +
          connection.escape(msg.body.game.id);
        connection.query(sql_game, function(err, game) {
          if (err) throw err;

          if(msg.body.tip == 'quoteA') {
            quoteA = game[0].quoteA * decr;
          } else {
            quoteA = game[0].quoteA * incr;
          }
          
          if(msg.body.tip == 'quoteB') {
            quoteB = game[0].quoteB * decr;
          } else {
            quoteB = game[0].quoteB * incr;
          }
          
          if(msg.body.tip == 'quoteX') {
            quoteX = game[0].quoteX * decr;
          } else {
            quoteX = game[0].quoteX * incr;
          }
          
          if (quoteA < 1) { quoteA = 1; }
          if (quoteB < 1) { quoteB = 1; }
          if (quoteX < 1) { quoteX = 1; }
          
          console.log("quoteA: ", game[0].quoteA, quoteA);
          console.log("quoteB: ", game[0].quoteB, quoteB);
          console.log("quoteX: ", game[0].quoteX, quoteX);
          
          var sql_update = 'UPDATE games SET quoteA = ' +
            connection.escape(quoteA) + ', quoteB = ' +
            connection.escape(quoteB) + ', quoteX = ' +
            connection.escape(quoteX) + ' WHERE id = ' +
            connection.escape(msg.body.game.id); 
          
          connection.query(sql_update, function(err, result) {
            if (err) throw err;
          }); 
        });
      });
      
    });
    
    queue.bind('bettingExchange', 'odds_queue');
  });
}

// Start server

services.getRabbitMqConnection(function(conn) {
  if (conn) {
    setup(conn);
  } else {
    console.log("failed to connect to rabbitmq");
  }
});
