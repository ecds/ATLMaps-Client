import faker from 'faker';

export default [
  {
    id: 1,
    name: faker.lorem.slug(),
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    layers: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    thumb: {
      url: faker.internet.url()
    }
  },
  {
    id: 2,
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    layers: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    thumb: {
      url: faker.internet.url()
    }
  },
  {
    id: 3,
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    layers: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    thumb: {
      url: faker.internet.url()
    }
  }
];
