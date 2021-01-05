import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ask-cookie-consent', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    document.cookie = `hideIntroFor-22=yup; expires=${new Date(0).toUTCString()};`;
    document.cookie = `cookieConsent=false; expires=${new Date(0).toUTCString()};`;
  });

  test('it hides and does not set cookie', async function(assert) {
    await render(hbs`<AskCookieConsent />`);
    assert.equal(document.cookie, '');
    assert.dom('#decline-cookies').exists();
    assert.dom('#allow-cookies').exists();
    await click('#decline-cookies');
    assert.equal(document.cookie, '');
    assert.dom('#decline-cookies').doesNotExist();
    assert.dom('#allow-cookies').doesNotExist();
  });

  test('it hides and sets cookie', async function(assert) {
    document.cookie = `cookieConsent=false; expires=${new Date(0).toUTCString()};`;
    await render(hbs`<AskCookieConsent />`);
    assert.equal(document.cookie, '');
    assert.dom('#decline-cookies').exists();
    assert.dom('#allow-cookies').exists();
    await click('#allow-cookies');
    assert.equal(document.cookie, 'cookieConsent=true');
    assert.dom('#decline-cookies').doesNotExist();
    assert.dom('#allow-cookies').doesNotExist();
    // clear cookie for next test
    document.cookie = `cookieConsent=false; expires=${new Date(0).toUTCString()};`;
    assert.equal(document.cookie, '');
  });

  test('it does not show when cookie present', async function(assert) {
    assert.equal(document.cookie, '');
    document.cookie = `cookieConsent=true; expires=${new Date(Date.now() + 100000).toUTCString()};`;
    assert.equal(document.cookie, 'cookieConsent=true');
    await render(hbs`<AskCookieConsent />`);
    assert.dom('#decline-cookies').doesNotExist();
    assert.dom('#allow-cookies').doesNotExist();
  });
});
