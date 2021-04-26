import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import UIKit from 'uikit';

module('Integration | Component | project-ui/explore-instructions', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('session', this.owner.lookup('service:session'));
    document.cookie = `cookieConsent=false; expires=${new Date(0).toUTCString()};`;
  });

  test('it renders cookies not allowed not authenticated', async function(assert) {
    await render(hbs`<ProjectUi::ExploreInstructions />`);
    assert.equal(this.element.textContent.trim(), 'Save');

    // Template block usage:
    await render(hbs`
      <ProjectUi::ExploreInstructions>
      </ProjectUi::ExploreInstructions>
    `);

    assert.dom('article').includesText('sign in');
    assert.dom('article').includesText('cookies');
  });

  test('it accepts cookies', async function(assert) {
    // Template block usage:
    await render(hbs`
    <div id='auth-modal' uk-modal></div>
      <ProjectUi::ExploreInstructions>
      </ProjectUi::ExploreInstructions>
    `);

    assert.dom('article').includesText('sign in');
    assert.dom('article').includesText('cookies');
    await click('button');
    assert.equal(document.cookie, 'cookieConsent=true');
    UIKit.modal('#auth-modal').$destroy();
  });

  test('it renders cookies allowed not authenticated', async function(assert) {
    document.cookie = `cookieConsent=true; expires=${new Date(Date.now() + 100000).toUTCString()};`;
    await render(hbs`<ProjectUi::ExploreInstructions />`);
    assert.equal(this.element.textContent.trim(), 'Save');

    // Template block usage:
    await render(hbs`
      <ProjectUi::ExploreInstructions>
      </ProjectUi::ExploreInstructions>
    `);

    assert.dom('article').includesText('sign in');
    assert.dom('article').doesNotContainText('cookies');
  });

  test('it renders cookies allowed and authenticated', async function(assert) {
    document.cookie = `cookieConsent=true; expires=${new Date(0).toUTCString()};`;
    this.session.isAuthenticated = true;
    await render(hbs`<ProjectUi::ExploreInstructions />`);
    assert.equal(this.element.textContent.trim(), 'Save');

    // Template block usage:
    await render(hbs`
      <ProjectUi::ExploreInstructions>
      </ProjectUi::ExploreInstructions>
    `);

    assert.dom('article').includesText('save');
    assert.dom('article').doesNotContainText('sign in');
    assert.dom('article').doesNotContainText('cookies');
});
});
