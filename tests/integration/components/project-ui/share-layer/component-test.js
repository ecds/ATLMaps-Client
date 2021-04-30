import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'atlmaps-client/config/environment';

module('Integration | Component | project-ui/share-layer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const rasterLayer = this.store.createRecord(
      'rasterLayer',
      {
        id: 666,
        name: Math.random().toString(36).substring(2, 15)
      }
    );
    this.set('rasterLayer', rasterLayer);

    const vectorLayer = this.store.createRecord(
      'vectorLayer',
      {
        id: 666,
        name: Math.random().toString(36).substring(2, 15),
        dataType: 'LineString',
        geometryType: 'poo'
      }
    );
    this.set('vectorLayer', vectorLayer);
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::ShareLayer @layer={{this.rasterLayer}} />`);
    assert.dom(`button[target="#share-modal-${this.rasterLayer.name}"]`).exists();
    assert.dom(`button[target="#embed-modal-${this.rasterLayer.name}"]`).exists();
    assert.dom(`div#share-modal-${this.rasterLayer.name} input`).hasValue(`${ENV.absoluteBase}/layers/${this.rasterLayer.name}`);
    assert.dom(`div#embed-modal-${this.rasterLayer.name} input`).hasValue(`<iframe height=600 width=800 src="${ENV.absoluteBase}/embed/${this.rasterLayer.name}?base=street&color=%231e88e5" />`);
  });

  test('it updates parameters', async function(assert) {
    await render(hbs`<ProjectUi::ShareLayer @layer={{this.vectorLayer}} />`);
    assert.dom(`div#embed-modal-${this.vectorLayer.name} input`).hasValue(`<iframe height=600 width=800 src="${ENV.absoluteBase}/embed/${this.vectorLayer.name}?base=street&color=%231e88e5" />`);
    const bases = findAll(`div#embed-modal-${this.vectorLayer.name} select option`);
    await fillIn(`div#embed-modal-${this.vectorLayer.name} select`, bases[1].value);
    assert.dom(`div#embed-modal-${this.vectorLayer.name} input`).hasValue(`<iframe height=600 width=800 src="${ENV.absoluteBase}/embed/${this.vectorLayer.name}?base=grayscale&color=%231e88e5" />`);
    await fillIn(`input#layer-${this.vectorLayer.name}`, '#000000');
    await click('button.uk-button-primary');
    assert.dom(`div#embed-modal-${this.vectorLayer.name} input`).hasValue(`<iframe height=600 width=800 src="${ENV.absoluteBase}/embed/${this.vectorLayer.name}?base=grayscale&color=%23000000" />`);
  });
});
