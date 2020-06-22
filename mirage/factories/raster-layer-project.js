import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
  position(i) {
    return i + 10;
  },

  project: association(),
  rasterLayer: association(),
});
