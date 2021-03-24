import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | institution', function(hooks) {
  setupTest(hooks);


  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('institution', {});
    assert.ok(model);
  });
});
