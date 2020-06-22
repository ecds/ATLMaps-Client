import faker from 'faker';

export default [
  {
    id: 1,
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(),
    rasterLayerIds: [1, 2, 3],
    vectorLayerIds: [1, 2, 3]
  },
  {
    id: 2,
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(),
    rasterLayerIds: [],
    vectorLayerIds: [1, 2, 3]
  },
  {
    id: 3,
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(),
    rasterLayerIds: [1, 2, 3],
    vectorLayerIds: []
  }
];
