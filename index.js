var path = require('path');
var logger = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var errors = require('./lib/errors');
var session = require('./lib/session');
var routes = require('./lib/routes/index');
var auth = require('./lib/routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sessions and authentication
session.initialize(app);

// routing
app.use('/', routes);
app.use('/auth', auth);

// error handling
errors.notfound(app);
errors.handlers(app);

module.exports = app;
