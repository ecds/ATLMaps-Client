import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/vector-panel/opacity-slider', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('layer', { opacity: "30" });
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::VectorPanel::OpacitySlider @vectorLayer={{this.layer}} />`);

    assert.dom('input[type="number"]').hasValue('30');
    assert.dom('input[type="range"]').hasValue('30');

  });
});
