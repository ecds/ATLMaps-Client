import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  displayname() {
    return 'Ford Prefect';
  },

  id() {
    return 1;
  }
});
