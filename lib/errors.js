var errors = exports; exports.constructor = function errors(){};

errors.notfound = function(app) {
  // Routes not found are errors
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });
};

errors.handlers = function(app) {
  // Development handler provides stacktraces
  if (app.get('env') !== 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // Production handler only provides the error message
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};
