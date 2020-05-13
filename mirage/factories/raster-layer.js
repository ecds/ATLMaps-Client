import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  name() {
    return faker.lorem.slug;
  },

  title() {
    return faker.lorem.word;
  },

  url() {
    return faker.internet.url;
  },

  layers() {
    return faker.lorem.slug;
  },

  description() {
    return faker.lorem.paragraph;
  },

  thumb() {
    return {
      url: faker.internet.avatar
    };
  }
});
