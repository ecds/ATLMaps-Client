import { moduleForModel, test } from 'ember-qunit';

moduleForModel('vector-feature', 'Unit | Model | vector feature', {
  // Specify the other units that are required for this test.
  needs: ['model:vector-layer']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
