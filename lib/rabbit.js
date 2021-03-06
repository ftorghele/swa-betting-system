var connection = require('../db.js'),
    appConfig = require('../config'),
    services = require('../lib/services.js');
    
exports.analyzegame = function (req, res) {
        
  var sql = 'SELECT * FROM games WHERE transmitted = 0 AND endTime <= NOW()';
  
  connection.query(sql, function(err, result) {
    if (err) throw err;
    
    // message rausschicken mit daten der zu verarbeitenden games
    
    services.getRabbitMqConnection(function(conn) {
    
      var ex = conn.exchange(appConfig.exchange.name, appConfig.exchange.parameters, function(ex) {
        
        var queue = conn.queue(appConfig.analyzequeue.name, appConfig.analyzequeue.parameters, function() {
            queue.bind(appConfig.exchange.name, '');
        });
      });
      
      for(var i = 0; i < result.length; i++) {
        ex.publish(appConfig.analyzequeue.name, {body: result[i]});
        var transmitted_sql = 'UPDATE games SET transmitted = 1 WHERE id = ' + result[i].id;
        connection.query(transmitted_sql, function(err, result) {
          if (err) throw err;
        });
      }
    });
    
  });    
}

exports.odds = function (data) {
          
    // message rausschicken mit daten der zu verarbeitenden games    
    services.getRabbitMqConnection(function(conn) {
    
      var ex = conn.exchange(appConfig.exchange.name, appConfig.exchange.parameters, function(ex) {
        
        var queue = conn.queue(appConfig.oddsqueue.name, appConfig.oddsqueue.parameters, function() {
            queue.bind(appConfig.exchange.name, '');
        });
      });
      
        ex.publish(appConfig.oddsqueue.name, {body: data});

    });
    
}