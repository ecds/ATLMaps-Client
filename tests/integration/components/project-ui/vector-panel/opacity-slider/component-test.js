import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

module('Integration | Component | project-ui/vector-panel/opacity-slider', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {

    this.set('layer', { vectorLayer: { opacity: "30" }});

    const vectorTile = EmberObject.create({
      vectorLayer: {
        dataFormat: 'pbf',
        leafletObject: {}
      },
      vectorTileStyles: A(
        [
          {
            id: 'Reynoldstown',
            style: {
              fillOpacity: .2
            }
          }
        ]
      )
    });
    this.set('opacityValue', null);
    this.set ('vectorTile', vectorTile);
    this.vectorTile.vectorLayer.leafletObject.setFeatureStyle = () => {
      this.vectorTile.vectorTileStyles.firstObject.fillOpacity = this.opacityValue;
    };
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::VectorPanel::OpacitySlider @vector={{this.layer}} />`);
    assert.dom('input[type="number"]').hasValue('30');
    assert.dom('input[type="range"]').hasValue('30');
  });

  test('it updates vector tile feature style', async function(assert) {
    await render(hbs`<ProjectUi::VectorPanel::OpacitySlider @vector={{this.vectorTile}} />`);
    await fillIn('input[type="number"]', 30);
    this.set('opacityValue', this.element.querySelector('input[type="number"]').value / 100);
    assert.equal(this.vectorTile.vectorTileStyles.firstObject.style.fillOpacity, this.opacityValue);
    await fillIn('input[type="range"]', '90');
    this.set('opacityValue', this.element.querySelector('input[type="range"]').value / 100);
    assert.equal(this.vectorTile.vectorTileStyles.firstObject.style.fillOpacity, this.opacityValue);
  });
});
