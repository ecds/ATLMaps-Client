import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | ecds_session', function(hooks) {
  setupTest(hooks);


  test('it exists', function(assert) {
    let service = this.owner.lookup('service:ecds-session');
    assert.ok(service);
  });
});
