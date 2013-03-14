
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
    var User = {};
    var sql = 'SELECT count(*) FROM users WHERE fbId = ' + connection.escape(profile.id);
    connection.query(sql, function(err, result) {
      if (err) throw err;
    
      console.log(result);


    });






/*
    User.findOne({providerId: profile.id},
      function(err, user) {
        if (!err && user != null) {
          var ObjectId = mongoose.Types.ObjectId;
          User.update({"_id": user["_id"]}, { $set: {lastConnected: new Date()} } ).exec();
        } else {
          var userData = new User({
            provider: profile.provider,
            providerUsername: profile.username,
            providerId: profile.username + ":" + profile.id,
            created: Date.now(),
            oauthToken: token,
            username: profile.displayName,
            profilePicture: 'https://api.twitter.com/1/users/profile_image?screen_name=' + profile.username +'&size=bigger'
          });
          userData.save(function(err) {
            if (err) console.log(err);
            else console.log('Saving user...');
          });
        }
      }
      );
      var user = { id: profile.id, name: profile.username });
      done(null, user);
      */
  }
));


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

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
