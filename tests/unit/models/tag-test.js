import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('tag', {
  // Specify the other units that are required for this test.
  needs: ['model:layer', 'model:project', 'model:raster-layer', 'model:vector-layer', 'model:category']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
