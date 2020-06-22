import faker from 'faker';

export default [
  {
    id: 1,
    name: faker.lorem.sentence(),
    vectorLayerId: 1,
    projectId: 1
  },
  {
    id: 2,
    vectorLayerId: 2,
    projectId: 1
  },
  {
    id: 3,
    vectorLayerId: 3,
    projectId: 1
  }
];
