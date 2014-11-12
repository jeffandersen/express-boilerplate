var session = exports; exports.constructor = function session(){};

var _ = require('lodash');
var passport = require('passport');
var expressSession = require('express-session');
var GitHubStrategy = require('passport-github').Strategy;
var RedisStore = require('connect-redis')(expressSession);

if (!_.has(process.env, 'GITHUB_CLIENT_ID')) {
  throw new Error('Missing configuration value for GITHUB_CLIENT_ID');
}

if (!_.has(process.env, 'GITHUB_CLIENT_SECRET')) {
  throw new Error('Missing configuration value for GITHUB_CLIENT_SECRET');
}

if (!_.has(process.env, 'GITHUB_CALLBACK_URL')) {
  throw new Error('Missing configuration value for GITHUB_CALLBACK_URL');
}

var redis = require('./redis');

session.express = expressSession;

session.initialize = function(app) {
  if (!process.env.EXPRESS_SESSION_SECRET) {
    throw new Error('EXPRESS_SESSION_SECRET required');
  }

  // standard express session
  app.use(session.express({
    resave: false,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new RedisStore({ client: redis.client })
  }));

  // passport authentication
  app.use(passport.initialize());
  app.use(passport.session());
};

session.authenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/auth/login');
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, lookupUser));

function lookupUser(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    profile.access_token = accessToken;
    done(null, profile);
  });
}

session.passport = passport;
