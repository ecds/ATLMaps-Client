import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/opacity-slider', function(hooks) {
  setupRenderingTest(hooks);
  
  hooks.beforeEach(function() {
    const rlp = { opacity: 100 };
    this.set('rlp', rlp);
  });
  
  test('it updates raster opacity', async function(assert) {
    // assert.expect(5);
    await render(hbs`<MapUi::OpacitySlider @opacity={{this.rlp.opacity}}/>`);
    assert.equal(this.element.querySelector('input').value, this.rlp.opacity);
    await fillIn('input.atlm-opacity-range-input', 50);
    assert.equal(this.rlp.opacity, 50);
  });
});
