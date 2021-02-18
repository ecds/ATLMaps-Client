import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/vector-panel/toggle-switch', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));

    const project = this.store.createRecord('project');

    let vlp = this.store.createRecord(
      'vector-layer-project',
      {
        project,
        vectorLayer: this.store.createRecord('vectorLayer', {
          id: 2,
          name: 'layer-2',
          leafletPane: { style: { zIndex: 2 }},
          dataType: 'qualitative',
          geometryType: 'Point'
        }),
        id: 2,
        order: 2,
        marker: 2,
        colorMap: {}
      }
    );

    this.set('vlp', vlp);
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::VectorPanel::ToggleSwitch @vector={{this.vlp}} />`);
    assert.true(this.vlp.get('vectorLayer.show'));
    assert.dom('button').hasText('hide');
    await click('button');
    assert.false(this.vlp.get('vectorLayer.show'));
    assert.dom('button').hasText('show');
  });
});
