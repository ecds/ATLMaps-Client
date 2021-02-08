import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

class CurrentUserStub extends Service {
  user = {
    displayname: 'Ford Prefect',
    projects: [1,2,3,4,5]
  }

  signout() {
    return true;
  }
}

module('Integration | Component | account-menu', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:current-user', CurrentUserStub);
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.currentUser = this.owner.lookup('service:current-user');

    await render(hbs`<AccountMenu @signOut={{this.currentUser.signout}} />`);

    assert.dom('input').hasValue('Ford Prefect');

  });
});
