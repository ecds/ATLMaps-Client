import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, findAll, render, settled, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
// import MapComponent from 'atlmaps-client/components/map';
import ENV from 'atlmaps-client/config/environment';

// let map;

module('Integration | Component | map', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const project = this.store.createRecord('project', { defaultBaseMap: 'street' });
    const rasterLayer = this.store.createRecord('rasterLayer', {
      name: 'atlanta',
      url: 'https://emory.edu'
    });
    const vectorLayer = this.store.createRecord('vectorLayer', {
      name: 'reynoldstown',
      dataType: 'Point',
      marker: 1,
      order: 2
    });
    this.store.createRecord('vectorFeature', {
      geojson: {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[-84.38914060064043,33.73599279936411]}],"properties":{}},
      vectorLayer: vectorLayer,
      geometryType: 'Point'
    });
    const vectorLayer2 = this.store.createRecord('vectorLayer', {
      name: 'sweetwater',
      dataType: 'Point',
      marker: 2,
      order: 1
    });
    this.store.createRecord('vectorFeature', {
      geojson: {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[-84.8914060064043,33.3599279936411]}],"properties":{}},
      vectorLayer: vectorLayer2,
      geometryType: 'Point'
    });
    const rlp = this.store.createRecord('rasterLayerProject', {project, rasterLayer, position: 11});
    let rasters = project.get('rasters');
    rasters.pushObject(rlp);
    const vlp = this.store.createRecord('vectorLayerProject', {project, vectorLayer});
    const vlp2 = this.store.createRecord('vectorLayerProject', {project, vectorLayer: vectorLayer2});
    let vectors = project.get('vectors');
    vectors.pushObject(vlp2);
    vectors.pushObject(vlp);
    this.set('model', project);
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-container').exists();
    assert.dom('.leaflet-tile-pane .base-street').exists();
    assert.dom('div#map-component span#center').hasText(`${ENV.APP.CENTER_LAT} : ${ENV.APP.CENTER_LNG}`);
    assert.dom('div#map-component span#zoom').hasText(ENV.APP.INITIAL_ZOOM.toString());

  });

  test('map has zoomControl at bottomLeft', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    // Leaflet's default is top left.
    assert.dom('div.leaflet-top.leaflet-left div.leaflet-control-zoom').doesNotExist();
    assert.dom('div.leaflet-bottom.leaflet-left div').hasClass('leaflet-control-zoom');
  });

  test('it adds layers to map', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('div.leaflet-marker-icon').exists();
    assert.dom('div.leaflet-reynoldstown-pane').exists();
    assert.dom('div.leaflet-tile-pane div.raster-atlanta').exists();
  });

  test('it activates feature when marker clicked', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.equal(findAll('.leaflet-marker-icon').length, 2);
    assert.dom('.leaflet-marker-icon.active').doesNotExist();
    await click('.leaflet-marker-icon');
    assert.equal(findAll('.leaflet-marker-icon.active').length, 1);
    assert.dom('.leaflet-marker-icon.active').exists();
    triggerKeyEvent('div.leaflet-container', 'keyup', 'Escape');
    await settled();
    assert.dom('.leaflet-marker-icon.active').doesNotExist();
    triggerKeyEvent('.leaflet-marker-icon', 'keyup', 'Enter');
    await settled();
    assert.equal(findAll('.leaflet-marker-icon.active').length, 1);
    triggerKeyEvent('div.leaflet-container', 'keyup', 'Tab');
    await settled();
    assert.equal(findAll('.leaflet-marker-icon.active').length, 1);
  });

  test('it adds raster layer', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-tile-pane .raster-atlanta').exists();
  });

  test('it switches base map', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-tile-pane .base-street').exists();
    this.model.setProperties({ defaultBaseMap: 'satellite'});
    await settled();
    assert.dom('.leaflet-tile-pane .base-street').doesNotExist();
    assert.dom('.leaflet-tile-pane .base-satellite').exists();
  });
});
