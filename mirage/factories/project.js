import { Factory } from 'ember-cli-mirage';
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
  }
});
