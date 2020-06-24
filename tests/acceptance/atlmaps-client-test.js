import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | atlmaps client', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.set('project', this.server.create('project'));
  });

  test('visiting /', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('div nav.uk-navbar-container div.uk-navbar-left a.home').hasText('ATLMaps');

    assert.dom('div nav.uk-navbar-container ul.uk-navbar-nav li a.projects').hasText('Projects');
    assert.dom('div nav.uk-navbar-container ul.uk-navbar-nav li a.explore').hasText('Explore');

    // await click('div nav.uk-navbar-container ul.uk-navbar-nav li a.projects');
    // assert.equal(currentURL(), '/projects');

    // await click('div nav.uk-navbar-container ul.uk-navbar-nav li a.explore');
    // assert.equal(currentURL(), '/explore');

    // await click('div nav.uk-navbar-container div.uk-navbar-left a.home');
    // assert.equal(currentURL(), '/');
  });

  test('visiting /projects', async function(assert) {
    await visit('/projects');
    assert.equal(currentURL(), '/projects');
    assert.dom('div nav.uk-navbar-container ul.uk-navbar-nav li a.projects').hasClass('active');
    assert.dom('div nav.uk-navbar-container ul.uk-navbar-nav li a.explore').doesNotHaveClass('active');
  });

  test('visiting /explore', async assert => {
    await visit('/explore');
    assert.equal(currentURL(), '/explore');
    assert.dom('div nav.uk-navbar-container ul.uk-navbar-nav li a.explore').hasClass('active');
    assert.dom('div nav.uk-navbar-container ul.uk-navbar-nav li a.projects').doesNotHaveClass('active');
  });

  test('visit /projects/1', async assert => {
    await visit('/projects/1');
    assert.equal(currentURL(), '/projects/1');
  });
});
