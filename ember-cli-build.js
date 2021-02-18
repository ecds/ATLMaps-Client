'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [ require.resolve('ember-auto-import/babel-plugin') ]
    },

    'ember-uikit': {
      useIcons: false
    },
    'free-solid-svg-icons': 'all',
    'ember-composable-helpers': {
      only: ['toggle']
    }
  });

  return app.toTree();
};
