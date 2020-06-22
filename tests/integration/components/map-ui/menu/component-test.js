import { module, test } from 'qunit';
import { click, render, settled, waitFor /*, waitUntil */ } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/menu', function(hooks) {
  setupRenderingTest(hooks);
  
  hooks.beforeEach(function() {
    this.set('model', this.server.create('project'));
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::Menu @project={{this.model}}/>`);
    await settled();
    await waitFor('.uk-open');
    assert.dom('#uk-accordion.uk-accordion').exists();
    assert.dom('.atlm-map-ui-project-menu-options.uk-tab').exists();
    assert.dom('#uk-accordion.uk-accordion li a.uk-accordion-title').hasText('Hide Menu');
    assert.dom('.atlm-project-title h3').hasText(this.model.name);
    assert.dom('article.atlm-project-description').hasText(this.model.description);
  });

  test('menu expands when clicked', async function(assert) {
    await render(hbs`<MapUi::Menu @project={{this.model}}/>`);
    await settled();
    // Menu Shows
    assert.dom('li.main-menu-toggle').hasClass('uk-open');
    await settled();
    // assert.dom('.atl-project-title').doesNotHaveClass('uk-animation-reverse');
    assert.dom(".uk-accordion-content.atlm-project-panel").doesNotHaveAttribute('hidden');
    // Menu hidden
    await click('#uk-accordion.uk-accordion li a.uk-accordion-title');
    await settled();
    assert.dom('.atlm-project-title').hasClass('uk-animation-slide-right-small');
    assert.dom('li.main-menu-toggle').doesNotHaveClass('uk-open');
    assert.dom('#uk-accordion.uk-accordion li a.uk-accordion-title').hasText('Show Menu');
  });
});
