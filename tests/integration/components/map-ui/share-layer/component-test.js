import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/share-layer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const rasterLayer = this.store.createRecord(
      'rasterLayer',
      {
        name: Math.random().toString(36).substring(2, 15)
      }
    );
    this.set('rasterLayer', rasterLayer);

    const vectorLayer = this.store.createRecord(
      'rasterLayer',
      {
        name: Math.random().toString(36).substring(2, 15),
        dataType: 'LineString'
      }
    );
    this.set('vectorLayer', vectorLayer);
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::ShareLayer @layer={{this.rasterLayer}} />`);
    assert.dom(`footer button[target="#share-modal-${this.rasterLayer.name}"]`).exists();
    assert.dom(`footer button[target="#embed-modal-${this.rasterLayer.name}"]`).exists();
    assert.dom(`div#share-modal-${this.rasterLayer.name} input`).hasValue(`${window.location.origin}/layers/${this.rasterLayer.name}`);
    assert.dom(`div#embed-modal-${this.rasterLayer.name} input`).hasValue(`<iframe height=600 width=800 src=${window.location.origin}/embed/${this.rasterLayer.name}?base=street />`);
  });

  test('it updates parameters', async function(assert) {
    await render(hbs`<MapUi::ShareLayer @layer={{this.vectorLayer}} />`);
    assert.dom(`div#embed-modal-${this.vectorLayer.name} input`).hasValue(`<iframe height=600 width=800 src=${window.location.origin}/embed/${this.vectorLayer.name}?base=street />`);
    const bases = findAll(`div#embed-modal-${this.vectorLayer.name} select option`);
    await fillIn(`div#embed-modal-${this.vectorLayer.name} select`, bases[1].value);
    assert.dom(`div#embed-modal-${this.vectorLayer.name} input`).hasValue(`<iframe height=600 width=800 src=${window.location.origin}/embed/${this.vectorLayer.name}?base=grayscale />`);
    await click('button.purple');
    await click('button.uk-button-primary');
    assert.dom(`div#embed-modal-${this.vectorLayer.name} input`).hasValue(`<iframe height=600 width=800 src=${window.location.origin}/embed/${this.vectorLayer.name}?base=grayscale&color=purple />`);
  });
});
