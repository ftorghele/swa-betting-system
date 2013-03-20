
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  passport = require('passport'),
  facebookStrategy = require('passport-facebook').Strategy,
  appConfig = require('./config'),
  api = require('./routes/api'),
  routes_filters = require('./routes/routes_filters.js'),
  services = require('./lib/services.js'),
  rabbit = require('./lib/rabbit'),
  connection = require('./db.js');
  
var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({ secret: appConfig.session_secret }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// CronJob

var cronJob = require('cron').CronJob;
new cronJob('*/10 * * * * *', function(){
    rabbit.analyzegame();
}, null, true, null);

// Passport

passport.use(new facebookStrategy({
    clientID: appConfig.fb.key,
    clientSecret: appConfig.fb.secret,
    callbackURL: appConfig.fb.callbackUrl
  },
  function(token, tokenSecret, profile, done) {
    var sql = 'SELECT * FROM users WHERE fbId = ' + connection.escape(profile.id);
    connection.query(sql, function(err, result) {
      if (err) throw err;

      if(result.length === 0) {
        var sql = 'INSERT INTO users (name, fbId) VALUES (' + connection.escape(profile.displayName) + 
                                                          ', ' + connection.escape(profile.id) + ');';
        connection.query(sql, function(err, result) {
          if (err) throw err;

          var sql = 'SELECT * FROM users WHERE fbId = ' + connection.escape(profile.id);
          connection.query(sql, function(err, result) {
            if (err) throw err;
            done(null, { id: result[0].id, name: result[0].name, fbId: result[0].fbId });
          });
        });
      } else {
        done(null, { id: result[0].id, name: result[0].name, fbId: result[0].fbId });        
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(id) + ' LIMIT 1;';
  connection.query(sql, function(err, result) {
    if (err) throw err;
    if(result.length === 0) {
      done(err, false);
    } else {
      done(null, { id: result[0].id, name: result[0].name, fbId: result[0].fbId });
    }
  });
});

// Passport Routes

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home',
                                    failureRedirect: '/auth/facebook'})
);
app.get('/logout', function(req, res) {
  req.logOut();
  res.redirect('/');
});

// Routes

app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/games', api.games);
app.post('/api/addgame', routes_filters.loggedInFilter, api.addgame);

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res) {
  res.render('index', {
    user: req.user,
    brand: 'SWABS'
  });
});

services.getRabbitMqConnection(function(conn) {
  if (conn) {
    app.listen(3000, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
  } else {
    console.log("failed to connect to rabbitmq");
  }
});
