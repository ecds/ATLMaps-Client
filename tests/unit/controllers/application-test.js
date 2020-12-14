import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | application', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.set('session', this.owner.lookup('service:session'));
    this.session.invalidate = () => {
      this.session.isAuthenticated = false;
    }
  });

  // Replace this with your real tests.
  test('it invalidates the session', function(assert) {
    this.session.isAuthenticated = true;
    assert.ok(this.session.isAuthenticated);
    let controller = this.owner.lookup('controller:application');
    controller.signOut();
    assert.notOk(this.session.isAuthenticated);
  });
});
