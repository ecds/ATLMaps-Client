import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/define-color-map', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const vectorLayer = this.store.createRecord(
      'vectorLayer',
      {
        properties: [
          { prop1: [111, 222] },
          { prop2: ['abc', 'xyz'] }
        ],
        geojson: {
          features: [
            {
              properties: {
                prop1: 111,
                prop2: 'abc'
              }
            },
            {
              properties: {
                prop1: 222,
                prop2: 'xyz'
              }
            }
          ]
        }
      }
    );

    const vectorProject = this.store.createRecord(
      'vectorLayerProject',
      {
        vectorLayer
      }
    );

    this.set('layer', { vectorProject, vectorLayer });

    this.set('cancel', function() { return true; });
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<div><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @test={{true}} /></div>`);
    const labels = findAll('label');
    assert.dom(labels[0]).hasText('prop1');
    assert.dom(labels[1]).hasText('prop2');
  });
});
