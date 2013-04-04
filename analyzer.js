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
        console.log("1: Quote A; 2: Quote B; 3: Quote X");
        console.log("And the winner is: ", value);
        
        var winner = '';
        
        if(value == 1) {
          winner = 'quoteA';
        } else if (value == 2) {
          winner = 'quoteB';
        } else if (value == 3) {
          winner = 'quoteX';
        }
        console.log("winner = ",winner);
        var sql = 'SELECT * FROM bets WHERE id_game = ' + 
          connection.escape(msg.body.id);
        connection.query(sql, function(err, result) {
        if (err) throw err;
          console.log(result);
          
          for(var bet in result){
            if(result[bet].tip == winner) {
              console.log(bet+": "+result[bet].quote);
            }
          }
          
        });
      });
       
    // wetten durchgehen
    // // gewinn berechnen
    // // gewinn verbuchen
    // // wettbeitrag löschen
      
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
