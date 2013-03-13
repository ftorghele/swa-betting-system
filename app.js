
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  appconfig = require('./config'),
  api = require('./routes/api');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({ secret: appconfig.session_secret }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

// MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : appconfig.mysql.host,
  user     : appconfig.mysql.user,
  password : appconfig.mysql.password,
  database : appconfig.mysql.database
});



passport.use(new FacebookStrategy({
    clientID: appconfig.fb.appid,
    clientSecret: appconfig.fb.secret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {};
    var sql = 'SELECT * FROM users WHERE fbId = ' + connection.escape(profile.id);
    connection.query(sql, function(err, results) {
      if (err) throw err;
    
      if(results.length === 0) {

        var sql = 'INSERT INTO users (name, fbId) VALUES (' + connection.escape(profile.displayName) + ', ' + connection.escape(profile.id) + ');';
        connection.query(sql, function(err, results) {
          if (err) throw err;
          user = { id: results[0].id, name: profile.name };
        });

      } else {
        user = { id: results[0].id, name: profile.name };
      }
    
      done(null, user);
    });

  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var user = {};
  var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
  connection.query(sql, function(err, results) {
    if (err) throw err;
    if(results.length === 0) {
      user = undefined;
    } else {
      user = { id: results[0].id, name: results[0].name };
    }
    
    done(err, user);
  });

});

app.locals({
    brand: 'Betting System',
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

app.get('/logout', function(req, res) {
  req.logout();
  console.log('logout');
  res.render('index');
});

// JSON API

app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
