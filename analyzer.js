/**
 * Module dependencies.
 */

var appConfig = require('./config'),
  services = require('./lib/services.js'),
  connection = require('./db.js');
  


function setup(conn) {
  var queue = conn.queue('analyze_queue', {durable: false}, function() {
    
    queue.subscribe(function(msg) {
      console.log(msg.body);
      
      
       // in anderer app
    // ergebnis berechnen
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
