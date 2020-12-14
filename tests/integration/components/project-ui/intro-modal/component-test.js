import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/intro-modal', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const project = this.store.createRecord(
      'project',
      {
        id: 22,
        name: 'Some Awesome Project',
        intro: 'Blah blah blah.'
      }
    );
    this.set('project', project);
  });

  test('it renders', async function(assert) {
    await render(hbs`<div id="container"><MapUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    assert.dom('h2').hasText(this.project.name);
    assert.dom('#intro-modal-text').hasText(this.project.intro);
  });

  test('it sets a cookie to suppress intro modal', async function(assert) {
    assert.equal(document.cookie, '');
    await render(hbs`<div id="container"><MapUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    await click('#toggle-hide-cookie');
    assert.equal(document.cookie, `hideIntroFor-${this.project.id}=yup`);
    document.cookie = `hideIntroFor-${this.project.id}=yup; expires=${new Date(0).toUTCString()};`;
    assert.equal(document.cookie, '');
  });

  test('it clears the cookie to suppress intro modal', async function(assert) {
    assert.equal(document.cookie, '');
    await render(hbs`<div id="container"><MapUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    await click('#toggle-hide-cookie');
    assert.equal(document.cookie, `hideIntroFor-${this.project.id}=yup`);
    await click('#toggle-hide-cookie');
    assert.equal(document.cookie, '');
  });

  test('it renders a UIKit Modal', async function(assert) {
    await render(hbs`<div id="container"><MapUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    assert.dom('.uk-modal').exists();
  });
});
