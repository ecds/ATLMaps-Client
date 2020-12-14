import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/define-color-map/manual-steps', function(hooks) {
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
    this.set('values', [111, 222]);

  });

  test('it renders setting range', async function(assert) {
    await render(hbs`<ProjectUi::DefineColorMap::ManualSteps @layer={{this.layer}} @values={{this.values}} />`);

    assert.equal(this.element.querySelector('#step-0-bottom').value, '111');
    assert.equal(this.element.querySelector('#step-0-top').value, '222');
  });

  test('it adds a new step when top value is changed', async function(assert) {
    await render(hbs`<ProjectUi::DefineColorMap::ManualSteps @layer={{this.layer}} @values={{this.values}} />`);
    await fillIn('#step-0-top', 151);
    assert.equal(this.element.querySelector('#step-1-bottom').value, '152');
    assert.equal(this.element.querySelector('#step-1-top').value, '222');
  });

  test('it corrects when middle step is updated', async function(assert) {
    await render(hbs`<ProjectUi::DefineColorMap::ManualSteps @layer={{this.layer}} @values={{this.values}} />`);
    await fillIn('#step-0-top', 151);
    await fillIn('#step-1-top', 181);
    assert.equal(this.element.querySelector('#step-2-bottom').value, '182');
    await fillIn('#step-1-top', 161);
    assert.equal(this.element.querySelector('#step-2-bottom').value, '162');
  });
});
