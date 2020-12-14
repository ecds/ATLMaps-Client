import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/define-color-map/manual-steps', function(hooks) {
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

  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MapUi::DefineColorMap::ManualSteps @layer={{this.layer}} @property="prop1" />`);

    assert.equal(this.element.querySelector('#step-0-bottom').value, '111');
    assert.equal(this.element.querySelector('#step-0-top').value, '222');
  });
});
