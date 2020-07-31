'use strict';

module.exports = {
  name: require('./package').name,

  included: function() {
    this._super.included.apply(this, arguments);

    let importTarget = this;

    if (typeof this.import !== 'function') {
      importTarget = this._findApp();
    }

    importTarget.import('node_modules/leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js');
    importTarget.import('node_modules/leaflet.vectorgrid/dist/Leaflet.VectorGrid.js');

  },

  // taken from ember-fetch
  _findApp() {
    if (typeof this._findHost === 'function') {
      return this._findHost();
    } else {
      // Otherwise, we'll use this implementation borrowed from the _findHost()
      // method in ember-cli.
      // Keep iterating upward until we don't have a grandparent.
      // Has to do this grandparent check because at some point we hit the project.
      let app;
      let current = this;
      do {
         app = current.app || this;
      } while (current.parent && current.parent.parent && (current = current.parent));

      return app;
    }
  },
};