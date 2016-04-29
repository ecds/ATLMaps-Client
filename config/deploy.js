/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    build: {environment: environment},
    s3: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        bucket: process.env.BUCKET,
        region: 'us-east-1'
    },
    redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PW,
        port: 6379
    }

    // include other plugin configuration that applies to all deploy targets here
  };


  if (environment === 'development') {
    ENV.buildEnv = 'development';
    // configure other plugins for development deploy target here
  }

  if (environment === 'staging') {
      ENV.buildEnv = 'staging';
    // configure other plugins for staging deploy target here
  }

  if (environment === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
