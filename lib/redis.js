var redis = exports; exports.constructor = function redis(){};

var redisLib = require('redis');

redis.initialize = function(cb) {
  var url = process.env.REDISCLOUD_URL;

  // if rediscloud is enabled use that
  if (url) {
    redis.client = redisLib.createClient(url);
  
  // otherwise look for localhost
  } else {
    redis.client = redisLib.createClient();
  }

  redis.client.on('ready', cb);
};
