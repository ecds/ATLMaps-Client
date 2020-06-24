import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled, triggerEvent, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/raster-panel', function(hooks) {
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
          rasterLayer: this.store.createRecord('rasterLayer', { onMap: true }),
          id: i,
          position: i + 10
        }
      );
      project.get('rasters').pushObject(rlp);
    });

    this.set('rasters', project.get('sortedRasters'));
    this.set('project', project);
  });

  test('it renders', async function(assert) {
    let raster1 = await this.store.peekRecord('raster-layer-project', 1);
    let raster2 = await this.store.peekRecord('raster-layer-project', 2);
    let raster3 = await this.store.peekRecord('raster-layer-project', 3);
    await render(hbs`<MapUi::RasterPanel @project={{this.project}} />`);
    await settled();
    assert.dom('li[data-layer="1"]').exists();
    assert.dom('li[data-layer="2"]').exists();
    assert.dom('li[data-layer="3"]').exists();
    assert.dom('li[data-layer="1"] div.atlm-reorder-button-up').exists();
    assert.dom('li[data-layer="1"] div.atlm-reorder-button-down').doesNotExist();
    assert.dom('li[data-layer="2"] div.atlm-reorder-button-down').exists();
    assert.dom('li[data-layer="2"] div.atlm-reorder-button-up').exists();
    assert.dom('li[data-layer="3"] div.atlm-reorder-button-down').exists();
    assert.dom('li[data-layer="3"] div.atlm-reorder-button-up').doesNotExist();
    assert.equal(raster1.position, 11);
    assert.equal(raster2.position, 12);
    assert.equal(raster3.position, 13);

    await triggerKeyEvent('li[data-layer="2"] div.atlm-reorder-button-up', 'keyup', 'Enter');
    assert.equal(raster1.position, 11);
    assert.equal(raster2.position, 13);
    assert.equal(raster3.position, 12);
    assert.dom('li[data-layer="2"] div.atlm-reorder-button-up').doesNotExist();
    assert.dom('li[data-layer="3"] div.atlm-reorder-button-up').exists();

    await click('li[data-layer="3"] div.atlm-reorder-button-down');
    assert.equal(raster1.position, 12);
    assert.equal(raster2.position, 13);
    assert.equal(raster3.position, 11);
    assert.dom('li[data-layer="3"] div.atlm-reorder-button-down').doesNotExist();
    assert.dom('li[data-layer="1"] div.atlm-reorder-button-down').exists();

    let el1 = this.element.querySelector('li[data-layer="2"]');
    let el2 = this.element.querySelector('li[data-layer="3"]');
    el1.parentNode.insertBefore(el1, el2);
    await triggerEvent('.uk-sortable', 'moved');
    assert.equal(raster1.position, 13);
    assert.equal(raster2.position, 12);
    assert.equal(raster3.position, 11);
  });
});
