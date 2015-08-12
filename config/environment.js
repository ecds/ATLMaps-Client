/* jshint node: true */

module.exports = function(environment) {

  var apiHost = 'http://api.atlmaps-dev.org';

  var ENV = {
    modulePrefix: 'atlmaps',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    // 'script-src': "'self' 'unsafe-eval'",
    'script-src': "*",
    'font-src': "'self'",
    'connect-src': "'self' http://api.atlmaps-dev.com:3000",
    'style-src': "'self' 'unsafe-inline'",
    'media-src': "'self'",
    'img-src': "*",
    'frame-src': "'self' http://www.youtube.com https://www.youtube.com"
  };

  ENV['simple-auth'] = {
    //authorizer: 'simple-auth-authorizer:oauth2-bearer',
    crossOriginWhitelist: [apiHost]
  };

  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: apiHost+'/oauth/token',
    serverTokenRevocationEndpoint: apiHost+'/oauth/revoke',
  };

  // var apiHost = 'https://api.atlmaps.com/';

  ENV['simple-auth'] = {
    authorizer: 'simple-auth-authorizer:oauth2-bearer',
    crossOriginWhitelist: [apiHost]
  };

  return ENV;
};
