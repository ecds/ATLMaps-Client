import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import L from 'leaflet';

module('Unit | Controller | project', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));

    const rasterLayer = this.store.createRecord('rasterLayer');
    this.set('rasterLayer', rasterLayer);
    const vectorLayer = this.store.createRecord('vectorLayer');
    this.set('vectorLayer', vectorLayer);
    this.set('project', this.store.createRecord('project', {
      leafletMap: {
        bounds: 'atlanta',
        getBounds: function() { return { extend: function() { return true; }}; },
        fitBounds: function() { return true; }
      }
    }));
    this.set('controller', this.owner.lookup('controller:project'));
    this.controller.model = { project: this.project };
  });

  // Replace this with your real tests.
  test('it exists', function(assert) {
    assert.ok(this.controller);
  });

  test('it adds and removes a raster layer', async function(assert) {
    this.project.get('rasters').pushObject(
      this.store.createRecord('rasterLayerProject', {
        project: this.project,
        rasterLayer: this.store.createRecord('rasterLayer'),
        position: 11
      })
    );
    assert.equal(this.rasterLayer.onMap, false);
    await this.controller.addRemoveRasterLayer.perform(this.rasterLayer);
    assert.equal(this.rasterLayer.onMap, true);
    this.rasterLayer.setProperties({
      leafletObject: { options: { zIndex: 12 }}
    });
    let rlp = await this.project.get('rasters').findBy('position', 12);
    assert.equal(rlp.position, 12);
    await this.controller.addRemoveRasterLayer.perform(this.rasterLayer);
    assert.equal(this.rasterLayer.onMap, false);
  });

  test('it adds and removes a vector layer', async function(assert) {
    assert.equal(this.vectorLayer.onMap, false);
    assert.equal(this.project.hasVectors, false);
    await this.controller.addRemoveVectorLayer.perform(this.vectorLayer);
    assert.equal(this.vectorLayer.onMap, true);
    assert.equal(this.project.hasVectors, true);
    this.rasterLayer.setProperties({
      leafletObject: { options: { zIndex: 11 }}
    });
    await this.controller.addRemoveVectorLayer.perform(this.vectorLayer);
    assert.equal(this.vectorLayer.onMap, false);
  });
});
