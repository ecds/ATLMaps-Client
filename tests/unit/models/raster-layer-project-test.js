import { moduleForModel, test } from 'ember-qunit';

moduleForModel('raster-layer-project', 'Unit | Model | raster layer project', {
  // Specify the other units that are required for this test.
  needs: ['model:project']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
