import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | raster layer', function(hooks) {
  setupTest(hooks);


  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('raster-layer', {});
    assert.ok(model);
  });
});
