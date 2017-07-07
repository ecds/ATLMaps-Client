import { moduleForModel, test } from 'ember-qunit';

moduleForModel('layer', 'Unit | Model | layer', {
  // Specify the other units that are required for this test.
  needs: ['model:project', 'model:tag', 'model:institution']
});

// test('it exists', function(assert) {
//   let model = this.subject();
//   // let store = this.store();
//   assert.ok(!!model);
// });
