'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'atlmaps-client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    absoluteBase: 'localhost',

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      CENTER_LAT: 33.75440100,
      CENTER_LNG: -84.3898100,
      INITIAL_ZOOM: 14,
      DEFAULT_BASE_MAP: 'grayscale',
      API_HOST: 'https://api.atlmaps-dev.com',
      DEFAULT_IMAGE: '/assets/images/logo-med.jpg',
      HOST: 'localhost'
    },

    fastboot: {
      hostWhitelist: ['atlmaps.org', 'atlmaps.ecdsdev.org', 'api.atlmaps-dev.com', /^lvh.me:\d+$/, '192.168.1.22:4200']
    },

    torii: {
      sessionServiceName: 'session',
      providers: {
        ecds: {}
      }
    },

    fauxOAuth: {
      baseUrl: 'http://auth.digitalscholarship.emory.edu/auth/'
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['staging'],
        config: {
          id: 'UA-71558106-1'
        }
      }
    ]
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['absoluteBase'] = 'https://lvh.me:4200';
    ENV['ember-cli-mirage'] = { enabled: false, autostart: false };
    ENV.APP.API_HOST = 'https://api.atlmaps-dev.com:3000';
    ENV.APP.HOST = 'https://lvh.me:4200';
    // ENV.APP.API_HOST = 'https://api.atlmaps.com';
    ENV['fauxOAuth'].tokenValidationUrl = 'https://api.atlmaps-dev.com:3000/auth/verify/';
    ENV['fauxOAuth'].tokenAuthUrl = 'https://api.atlmaps-dev.com:3000/auth/tokens/';
    ENV['fauxOAuth'].redirectUrl = 'https://lvh.me:4200/torii/redirect.html';

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';
    ENV.APP.API_HOST = '';
    ENV['fauxOAuth'].tokenAuthUrl = '/tokens/';
    ENV['ember-cli-mirage'] = { enabled: true, autostart: true };
    ENV['ember-a11y-testing'] = {
      componentOptions: {
        axeOptions: {
          rules: {
            'color-contrast': { enabled: false } // enable region rule
          },
          checks: {
            'color-contrast': { options: { noScroll: true } } // disable scrolling of color-contrast check
          }
        }
      }
    };

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.APP.HOST = 'https://atlmaps.org';
    ENV.APP.API_HOST = 'https://api.atlmaps.org';
    ENV['fauxOAuth'].tokenValidationUrl = 'https://api.atlmaps.org/auth/verify/';
    ENV['fauxOAuth'].tokenAuthUrl = 'https://api.atlmaps.org/auth/tokens/';
    ENV['fauxOAuth'].redirectUrl = 'https://atlmaps.org/torii/redirect.html';
  }

  if (environment == 'staging') {
    ENV.APP.HOST = 'https://atlmaps.ecdsdev.org';
    ENV.APP.API_HOST = 'https://atlmaps-api.ecdsdev.org';
    ENV['fauxOAuth'].tokenValidationUrl = 'https://atlmaps-api.ecdsdev.org/auth/verify/';
    ENV['fauxOAuth'].tokenAuthUrl = 'https://atlmaps-api.ecdsdev.org/auth/tokens/';
    ENV['fauxOAuth'].redirectUrl = 'https://atlmaps.ecdsdev.org/torii/redirect.html';
  }

  return ENV;
};
