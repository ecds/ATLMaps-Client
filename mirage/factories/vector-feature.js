import { Factory, trait } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  properties() {
    return {
      name: faker.lorem.sentence()
    };
  },

  withImages: trait({
    images: [faker.image.imageUrl(), faker.image.imageUrl()]
  }),

  withVimeo: trait({
    vimeo: faker.internet.url()
  }),

  withYoutube: trait({
    youtube: faker.internet.url()
  })
});