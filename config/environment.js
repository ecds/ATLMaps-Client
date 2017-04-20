/* jshint node: true */
/* globals module */

module.exports = function setUp(environment) {
    const ENV = {
        modulePrefix: 'atlmaps',
        environment,
        rootURL: '/',
        locationType: 'auto',

        // Empty hash that gets populated below depending on the environment.
        torii: {
            providers: {}
        },

        materializeDefaults: {
            modalIsFooterFxed: true,
            alignment: 'top center',
            alignmentTarget: 'top center'
        },

        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created

            // Ember does not have the search event built in. This is used
            // for text search and fires when the clear button is clicked.
            customEvents: { search: 'search' }
        },

        metricsAdapters: [{
            name: 'GoogleAnalytics',
            environments: ['all'],
            config: {
                id: ''
            }
        }]

    };

    if (environment === 'development') {
        ENV.absoluteBase = 'localhost:4200';
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
        ENV.APP.API_HOST = 'http://api.atlmaps-dev.com:3000';
        ENV.metricsAdapters[0].config.id = 'UA-71558106-1';

        ENV.torii.providers['facebook-oauth2'] = {
            apiKey: '382820178724645',
            redirectUri: 'http://localhost:4200/about'
        };
        ENV.torii.providers['google-oauth2'] = {
            apiKey: '646382922448-23d242gkptr9jodipnln87f5klhal48i.apps.googleusercontent.com',
            redirectUri: 'http://localhost:4200/about'
        };
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.rootURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'staging') {
        ENV.absoluteBase = 'http://atlmaps.ecdsweb.org';
        ENV.APP.API_HOST = 'http://atlmaps-api.ecdsweb.org';
        ENV.metricsAdapters[0].config.id = 'UA-71558106-1';

        ENV.torii.providers['facebook-oauth2'] = {
            apiKey: '1622636571366463',
            redirectUri: 'http://atlmaps.ecdsweb.org/'
        };
        ENV.torii.providers['google-oauth2'] = {
            apiKey: '615924131365-31oenop822l5v4cilaih5s22q6fpps3u.apps.googleusercontent.com',
            redirectUri: 'http://atlmaps.ecdsweb.org'
        };
    }

    if (environment === 'production') {
        ENV.absoluteBase = 'https://atlmaps.com';
        ENV.APP.API_HOST = 'https://api.atlmaps.com';
        ENV.metricsAdapters[0].config.id = 'UA-71558106-2';

        ENV.torii.providers['facebook-oauth2'] = {
            apiKey: '425398021183204',
            redirectUri: 'https://atlmaps.com/'
        };
        ENV.torii.providers['google-oauth2'] = {
            apiKey: '78026432363-8o0b40k5m86ob4o4cn5gkmn8pkc060on.apps.googleusercontent.com',
            redirectUri: 'https://atlmaps.com'
        };
    }

    ENV.contentSecurityPolicy = {
        'default-src': "'none'",
        // 'script-src': "'self' 'unsafe-eval'",
        'script-src': '*',
        'font-src': "'self' http://fonts.googleapis.com http://fonts.googleapis.com http://fonts.gstatic.com https://fonts.gstatic.com https://s3.amazonaws.com",
        'connect-src': "'self' http://api.atlmaps-dev.com:3000 http://api.atlmaps-dev.org https://api.atlmaps.com https://s3.amazonaws.com http://vimeo.com https://vimeo.com",
        'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com https://fonts.googleapis.com",
        'media-src': "'self'",
        'img-src': '* data:',
        'frame-src': "'self' http://www.youtube.com https://www.youtube.com https://youtu.be"
    };

    // ENV['ember-simple-auth'] = {
    //   //authorizer: 'simple-auth-authorizer:oauth2-bearer',
    //   crossOriginWhitelist: [ENV.APP.API_HOST]
    // };
    //
    // ENV['ember-simple-auth-oauth2'] = {
    //   serverTokenEndpoint: ENV.APP.API_HOST+'/oauth/token',
    //   serverTokenRevocationEndpoint: ENV.APP.API_HOST+'/oauth/revoke',
    // };
    //
    // // var apiHost = 'https://api.atlmaps.com/';
    //
    // ENV['ember-simple-auth'] = {
    //   authorizer: 'ember-simple-auth-authorizer:oauth2-bearer',
    //   crossOriginWhitelist: [ENV.APP.API_HOST]
    // };

    //   ENV.sassOptions = {
    //   includePaths: [
    //     'node_modules/ember-modal-dialog/app/styles/ember-modal-dialog'
    //   ]
    // };

    return ENV;
};
