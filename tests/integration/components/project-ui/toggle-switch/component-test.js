import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { click, triggerKeyEvent, waitFor } from '@ember/test-helpers';

module('Integration | Component | project-ui/toggle-switch', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const project = this.store.createRecord('project');
    let a = [1, 2, 3];
    a.forEach( i => {
      let rlp = this.store.createRecord(
        'raster-layer-project',
        {
          project,
          rasterLayer: this.store.createRecord('rasterLayer'),
          id: i,
          position: i + 10
        }
      );
      project.get('rasters').pushObject(rlp);
    });
    [3, 4].forEach( i => {
      let vlp = this.store.createRecord(
        'vector-layer-project',
        {
          project,
          vectorLayer: this.store.createRecord('vectorLayer'),
          id: i
        }
      );
      project.get('vectors').pushObject(vlp);
    });
    this.set('project', project);
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::ToggleSwitch @project={{this.project}} />`);
    assert.dom('div.atlm-toggle-switch svg').hasClass('fa-toggle-on');
    assert.dom('div.atlm-toggle-status').hasText('Hide Layers');

    await click('div.atlm-toggle');
    assert.dom('div.atlm-toggle-switch svg').hasClass('fa-toggle-off');
    assert.dom('div.atlm-toggle-status').hasText('Show Layers');
    assert.equal(this.project.allLayersHidden, true);

    await click('div.atlm-toggle');
    assert.dom('div.atlm-toggle-switch svg').hasClass('fa-toggle-on');
    assert.dom('div.atlm-toggle-status').hasText('Hide Layers');
    assert.equal(this.project.allLayersHidden, false);

    await triggerKeyEvent('div.atlm-toggle', 'keyup', 'Enter');
    assert.dom('div.atlm-toggle-switch svg').hasClass('fa-toggle-off');
    assert.dom('div.atlm-toggle-status').hasText('Show Layers');
    assert.equal(this.project.allLayersHidden, true);

    let layer = this.store.peekRecord('rasterLayerProject', 2);
    layer.setProperties({ opacity: 50 });
    await waitFor('div.atlm-toggle-switch svg.fa-toggle-on');
    assert.equal(this.project.allLayersHidden, false);
    assert.dom('div.atlm-toggle-switch svg').hasClass('fa-toggle-on');
    assert.dom('div.atlm-toggle-status').hasText('Hide Layers');
  });
});
