/* jshint node: true */

module.exports = function(environment) {

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
      API_HOST: 'http://api.atlmaps-dev.com:3000'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.API_HOST = 'http://api.atlmaps-dev.com:3000';
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

  if (environment === 'staging') {
    ENV.APP.API_HOST = 'http://api.atlmaps-dev.org';
  }

  if (environment === 'production') {
    ENV.APP.API_HOST = 'http://api.atlmaps.com';
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
    crossOriginWhitelist: [ENV.APP.API_HOST]
  };

  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: ENV.APP.API_HOST+'/oauth/token',
    serverTokenRevocationEndpoint: ENV.APP.API_HOST+'/oauth/revoke',
  };

  // var apiHost = 'https://api.atlmaps.com/';

  ENV['simple-auth'] = {
    authorizer: 'simple-auth-authorizer:oauth2-bearer',
    crossOriginWhitelist: [ENV.APP.API_HOST]
  };

  ENV.sassOptions = {
  includePaths: [
    'node_modules/ember-modal-dialog/app/styles/ember-modal-dialog'
  ]
}

  return ENV;
};