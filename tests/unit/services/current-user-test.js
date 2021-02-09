import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Response } from 'ember-cli-mirage';

module('Unit | Service | current_user', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.set('service', this.owner.lookup('service:current-user'));
    this.set('session', this.owner.lookup('service:session'));
  });

  test('it exists', function(assert) {
    assert.ok(this.service);
  });

  test('it gets current user when authenticated', async function(assert) {
    this.server.get('/users/me', () => {
      return { data: { id: 1, type: 'users', attributes: { displayname: 'Ford Prefect' }}};
    });
    this.server.get('/users/1', () => {
      return { data: { id: 1, type: 'users', attributes: { displayname: 'Ford Prefect' }}};
    });
    this.session.isAuthenticated = true;
    let user = await this.service.setCurrentUser();
    assert.equal(user.displayname, 'Ford Prefect');
  });

  test('it gets null when not authenticated', async function(assert) {
    this.session.isAuthenticated = false;
    let user = await this.service.setCurrentUser();
    assert.equal(user, null);
  });

  test('it invalidates session when response is not `ok`', async function(assert) {
    this.session.isAuthenticated = true;
    this.session.session.invalidate = () => {
      this.session.isAuthenticated = false;
    };
    this.server.get('/users/me', () => {
      return new Response(404);
    });
    await this.service.setCurrentUser();
    assert.notOk(this.session.isAuthenticated);
  });

  test('it invalidates session when empty response', async function(assert) {
    this.session.isAuthenticated = true;
    this.session.session.invalidate = () => {
      this.session.isAuthenticated = false;
    };
    this.server.get('/users/me', () => {
      return null;
    });
    await this.service.setCurrentUser();
    assert.notOk(this.session.isAuthenticated);
  });

});
