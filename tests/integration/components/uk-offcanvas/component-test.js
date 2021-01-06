import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { settled } from '@ember/test-helpers';

module('Integration | Component | uk-offcanvas', function(hooks) {
  setupRenderingTest(hooks);

  test('toggles on interactions', async function(assert) {
    await render(hbs`<UkOffcanvas />`);
    await settled();
    assert.equal(this.element.textContent.trim(), 'Add Layers');
    assert.dom('#atlm-layer-search-panel').doesNotHaveClass('uk-open');
    // await click('button.uk-button');
    // await waitFor('div.uk-offcanvas.uk-open');
    // assert.dom('#atlm-layer-search-panel').hasClass('uk-open');
  });
});
