import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/define-color-map', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    this.set('colorBrewer', this.owner.lookup('service:colorBrewer'));
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
        },
        tempColor: {
          name: 'deeppink',
          hex: '#ff1493'
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
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} /></div>`);
    const labels = findAll('label');
    assert.dom(labels[0]).hasText('prop1');
    assert.dom(labels[1]).hasText('prop2');
  });

  test('it selects int property', async function(assert) {
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} /></div>`);
    await click('input#option-0');
    assert.dom('input#set-step').exists();
  });

  test('setting steps and color brewer group shows color options', async function(assert) {
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} /></div>`);
    await click('input#option-0');
    await fillIn('input#set-step', '5');
    assert.equal(this.layer.vectorProject.steps, 5);
    await click('input#div');
    assert.equal(this.layer.vectorProject.brewerGroup, 'diverging');
    const colors = findAll('div.cb-scheme-RdBu');
    assert.equal(colors.length, 5);
    await click('#PiYG');
    assert.equal(this.layer.vectorProject.brewerScheme, 'PiYG');
  });

  test('it selects a string', async function(assert) {
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} /></div>`);
    await click('input#option-1');
    const labels = findAll('label');
    const colorGroup = this.colorBrewer.getGroup('qualitative', 12).Paired;
    assert.dom(labels[0]).hasText('abc');
    assert.dom(labels[1]).hasText('xyz');
    assert.ok(
      colorGroup.includes(this.layer.vectorProject.colorMap.abc.color)
    );
    assert.ok(
      colorGroup.includes(this.layer.vectorProject.colorMap.xyz.color)
    );
    await fillIn('#value-option-xyz-color', '#29b6f6');
    assert.ok(
      colorGroup.includes(this.layer.vectorProject.colorMap.abc.color)
    );
    assert.equal(
      this.layer.vectorProject.colorMap.xyz.color,
      '#29b6f6'
    );
  });

  test('it edits colorMap with manual steps', async function(assert) {
    this.layer.vectorProject.setProperties(
      {
        colorMap: [{ bottom: 111, top: 151 }, { bottom: 152, top: 222 }],
        property: 'prop1',
        brewerGroup: 'sequential',
        steps: 2,
        manualSteps: true
      }
    );
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} @edit={{true}} /></div>`);
    await click('#Reds');
    assert.equal(this.layer.vectorProject.colorMap[0].color, '#a50f15');
    assert.equal(this.layer.vectorProject.colorMap[1].color, '#67000d');
  });

  test('it resets from start over button', async function(assert) {
    this.layer.vectorProject.setProperties(
      {
        colorMap: [{ bottom: 111, top: 151 }, { bottom: 152, top: 222 }],
        property: 'prop1',
        brewerGroup: 'sequential',
        steps: 2,
        manualSteps: true
      }
    );
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} @edit={{true}} /></div>`);
    await click('#back');
    assert.equal(this.layer.vectorProject.brewerGroup, null);
    assert.equal(this.layer.vectorProject.steps, null);
    assert.equal(this.layer.vectorProject.property, null);
    assert.equal(Object.keys(this.layer.vectorProject.colorMap).length, 0);
  });

  test('it reloads the layer without error', async function(assert) {
    this.layer.vectorProject.setProperties(
      {
        colorMap: [{ bottom: 111, top: 151 }, { bottom: 152, top: 222 }],
        property: 'prop1',
        brewerGroup: 'sequential',
        steps: 2,
        manualSteps: true
      }
    );
    await render(hbs`<div id="container"><MapUi::DefineColorMap @layer={{this.layer}} @cancel={{this.cancel}} @isTesting={{true}} @edit={{true}} /></div>`);
    await click('#reload-layer');
    assert.equal(1, 1);
  });
});
