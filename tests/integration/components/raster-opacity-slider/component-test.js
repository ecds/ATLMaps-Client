import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | raster-opacity-slider', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('raster', {
      rasterLayer: {
        opacity: 80,
        name: 'hawks'
      }
    });
  });

  test('it renders', async function(assert) {
    await render(hbs`<RasterOpacitySlider @raster={{this.raster.rasterLayer}} />`);
    assert.dom('#opacity-slider-hawks').hasStyle({
      background: 'rgba(0, 0, 0, 0) linear-gradient(to right, rgb(244, 116, 4) 0%, rgb(244, 116, 4) 80%, rgb(255, 255, 255) 80%, rgb(255, 255, 255) 100%) repeat scroll 0% 0% / auto padding-box border-box'
    });
  });
});
