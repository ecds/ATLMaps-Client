import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/search-panel/filters/text', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::SearchPanel::Filters::Text />`);
    assert.dom('form label').hasText('Text Filter');
    assert.dom('form section div input').exists();
  });

  test('it updates textToSearch', async function(assert) {
    await render(hbs`<ProjectUi::SearchPanel::Filters::Text />`);
    await fillIn('input#atlm-layer-text-search', 'Don\'t Panic');
    await click('button');
    assert.dom('.testing #text-to-search').hasText('Don\'t Panic');
  });
});
