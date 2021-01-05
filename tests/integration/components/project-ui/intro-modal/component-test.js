import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/intro-modal', function(hooks) {
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
    document.cookie = `hideIntroFor-${this.project.id}=yup; expires=${new Date(0).toUTCString()};`;
    document.cookie = `cookieConsent=true; expires=${new Date(Date.now() + 100000).toUTCString()};`;
  });

  test('it renders', async function(assert) {
    await render(hbs`<div id="container"><ProjectUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    assert.dom('h2').hasText(this.project.name);
    assert.dom('#intro-modal-text').hasText(this.project.intro);
  });

  test('it sets a cookie to suppress intro modal', async function(assert) {
    assert.equal(document.cookie, 'cookieConsent=true');
    await render(hbs`<div id="container"><ProjectUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    await click('#toggle-hide-cookie');
    assert.equal(document.cookie, `cookieConsent=true; hideIntroFor-${this.project.id}=yup`);
    document.cookie = `hideIntroFor-${this.project.id}=yup; expires=${new Date(0).toUTCString()};`;
    assert.equal(document.cookie, 'cookieConsent=true');
  });

  test('it clears the cookie to suppress intro modal', async function(assert) {
    assert.equal(document.cookie, 'cookieConsent=true');
    await render(hbs`<div id="container"><ProjectUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    await click('#toggle-hide-cookie');
    assert.equal(document.cookie, `cookieConsent=true; hideIntroFor-${this.project.id}=yup`);
    await click('#toggle-hide-cookie');
    assert.equal(document.cookie, 'cookieConsent=true');
  });

  test('it renders a UIKit Modal', async function(assert) {
    await render(hbs`<div id="container"><ProjectUi::IntroModal @project={{this.project}} @isTesting={{true}} /></div>`);
    assert.dom('.uk-modal').exists();
  });

  test('it does not show option to hide when cookie consent has not been given', async function(assert) {
    document.cookie = `cookieConsent=false; expires=${new Date(0).toUTCString()};`;
    assert.dom('#toggle-hide-cookie').doesNotExist();
  });
});
