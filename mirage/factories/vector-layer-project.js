import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(vlp, server) {
    server.createList('vector-layer', 1, { vlp });
  }
});
