import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | raster layer project', function(hooks) {
  setupTest(hooks);


  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('raster-layer-project', {});
    assert.ok(model);
  });
});
