import { Factory, trait } from 'ember-cli-mirage';
import faker from 'faker';
import ENV from 'atlmaps-client/config/environment';

export default Factory.extend({
  name() {
    return faker.lorem.sentence();
  },

  description() {
    return faker.lorem.paragraph();
  },

  centerLat() {
    return ENV.APP.CENTER_LAT;
  },

  centerLng() {
    return ENV.APP.CENTER_LNG;
  },

  zoomLevel() {
    return ENV.APP.INITIAL_ZOOM;
  },

  withRasters: trait({
    hasRasters: true
  }),

  withVectors: trait({
    hasVectors: true
  }),

  afterCreate(project, server) {
    if (project.hasRasters) {
      [1, 2, 3].forEach(num => {
        server.create('raster-layer-project', { project, position: num + 11  });
      });

    }
  }
});
