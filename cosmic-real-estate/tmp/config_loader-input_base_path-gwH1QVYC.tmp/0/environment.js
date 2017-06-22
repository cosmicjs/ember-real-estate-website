/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'cosmic-real-estate',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    cosmic: {
      cosmicBucket: null,
      cosmicWriteKey: null,
      cosmicReadKey: null
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.cosmic.cosmicBucket = 'cosmic-real-estate';
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.cosmic.cosmicBucket = 'cosmic-real-estate';
    ENV.cosmic.cosmicReadKey = process.env.COSMIC_READ_KEY;
    ENV.cosmic.cosmicWriteKey = process.env.COSMIC_WRITE_KEY;
  }

  return ENV;
};
