import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { click, settled, waitFor } from '@ember/test-helpers';

module('Integration | Component | uk-offcanvas', function(hooks) {
  setupRenderingTest(hooks);

  test('toggles on interactions', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<UkOffcanvas />`);
    await settled();
    assert.equal(this.element.textContent.trim(), 'Find Layers');
    assert.dom('#atlm-layer-search-panel').doesNotHaveClass('uk-open');
    // await click('button.uk-button');
    // await waitFor('div.uk-offcanvas.uk-open');
    // assert.dom('#atlm-layer-search-panel').hasClass('uk-open');   
  });
});
