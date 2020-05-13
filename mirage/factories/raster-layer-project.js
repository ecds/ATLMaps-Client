import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  position(i) {
    return i + 10;
  }
});
