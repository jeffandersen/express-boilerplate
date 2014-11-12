var express = require('express');
var router = express.Router();

var passport = require('../session').passport;

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/github',
  passport.authenticate('github'),
  function(req, res){});

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
