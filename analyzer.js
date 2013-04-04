/**
 * Module dependencies.
 */

var appConfig = require('./config'),
  services = require('./lib/services.js'),
  random = require('secure_random'),
  connection = require('./db.js');
  


function setup(conn) {
  var queue = conn.queue('analyze_queue', {durable: false}, function() {
    
    queue.subscribe(function(msg) {
      console.log(msg.body);
      
      random.getRandomInt(1, 3, function(err, value) {
        // The value will between 1-3
        var winner = '';
        
        if(value == 1) {
          winner = 'quoteA';
        } else if (value == 2) {
          winner = 'quoteB';
        } else if (value == 3) {
          winner = 'quoteX';
        }

        var sql = 'SELECT * FROM bets WHERE id_game = ' + 
          connection.escape(msg.body.id);
        connection.query(sql, function(err, result) {
        if (err) throw err;
              
          for(var bet in result){
            if(result[bet].tip == winner) {
              var win = result[bet].quote * result[bet].amount;
              var sql_win = 'UPDATE users SET credits = credits + ' +
                win + ' WHERE id = ' +
                result[bet].id_user;
              connection.query(sql_win, function(err, result) {
                if (err) throw err;
              });
            }
            
            var sql_analyzed = 'UPDATE bets SET analyzed = 1 WHERE id = ' +
              result[bet].id;
            connection.query(sql_analyzed, function(err, result) {
              if (err) throw err;
            });
          }
          
        });
      });
    });
    
    queue.bind('bettingExchange', 'analyze_queue');
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
