
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  passport = require('passport'),
  facebookStrategy = require('passport-facebook').Strategy,
  appConfig = require('./config'),
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
  app.use(express.session({ secret: appConfig.session_secret }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
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

// MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : appConfig.mysql.host,
  user     : appConfig.mysql.user,
  password : appConfig.mysql.password,
  database : appConfig.mysql.database
});

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
          done(null, { id: result[0].id, name: result[0].name });
        });
      } else {
        done(null, { id: result[0].id, name: result[0].name });        
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
      var user = { id: result[0].id, name: result[0].name };
      done(err, user);
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

app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
