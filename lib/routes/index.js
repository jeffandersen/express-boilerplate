var express = require('express');
var router = express.Router();

var session = require('../session');
var passport = session.passport;

router.get('/',
  session.authenticated,
  function(req, res) {
    res.render('index', { title: 'Code Review' });
});

module.exports = router;
