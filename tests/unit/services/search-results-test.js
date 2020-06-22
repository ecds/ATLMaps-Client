import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | search-results', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:search-results');
    assert.ok(service);
  });
});
