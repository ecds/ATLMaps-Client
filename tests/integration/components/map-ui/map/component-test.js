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
    const rlp = this.store.createRecord('rasterLayerProject', {project, rasterLayer, position: 11});
    let rasters = project.get('rasters');
    rasters.pushObject(rlp);

    let vectors = project.get('vectors');
    const vectorLayer = this.store.createRecord('vectorLayer', {
      name: 'reynoldstown',
      dataType: 'Point'
    });
    this.store.createRecord('vectorFeature', {
      geojson: {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[-84.38561081886292,33.75298781890165]}],"properties":{}},
      vectorLayer: vectorLayer,
      geometryType: 'Point'
    });
    const vlp = this.store.createRecord('vectorLayerProject', {
      project, vectorLayer,
      marker: 1,
      order: 2
    });
    vectors.pushObject(vlp);

    const vectorLayer2 = this.store.createRecord('vectorLayer', {
      name: 'sweetwater',
      dataType: 'Point'
    });
    this.store.createRecord('vectorFeature', {
      geojson: {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[-84.39246654510497,33.75298781890165]}],"properties":{}},
      vectorLayer: vectorLayer2,
      geometryType: 'Point'
    });
    const vlp2 = this.store.createRecord('vectorLayerProject', {
      project,
      vectorLayer: vectorLayer2,
      order: 1,
      marker: 2
    });
    vectors.pushObject(vlp2);

    const polygon1 = this.store.createRecord('vectorLayer', {
      name: 'emory',
      dataType: 'MultiPolygon'
    });
    this.store.createRecord('vectorFeature', {
      geojson: {"type": "GeometryCollection","geometries": [{"type": "Polygon","coordinates":[[[-84.39246654510497,33.75298781890165],[-84.38561081886292,33.75298781890165],[-84.38561081886292,33.757849293789064],[-84.39246654510497,33.757849293789064],[-84.39246654510497,33.75298781890165]]]}],"properties": {"data": 2}},
      vectorLayer: polygon1,
      geometryType: 'MultiPolygon'
    });
    const vlp3 = this.store.createRecord('vectorLayerProject', {
      project,
      vectorLayer: polygon1,
      colorMap: {'0':{top: 3, bottom: 1, color: 'rgb(152, 0, 67)'}, '1':{top: 6, bottom: 4, color: '#f7f4f9'}},
      order: 4,
      property: 'data',
      marker: null
    });
    vectors.pushObject(vlp3);

    const polygon2 = this.store.createRecord('vectorLayer', {
      name: 'oxford',
      dataType: 'MultiPolygon'
    });
    this.store.createRecord('vectorFeature', {
      geojson: {"type": "GeometryCollection","geometries": [{"type": "Polygon","coordinates":[[[-84.39246654510497,33.75298781890165],[-84.38561081886292,33.75298781890165],[-84.38561081886292,33.757849293789064],[-84.39246654510497,33.757849293789064],[-84.39246654510497,33.75298781890165]]]}],"properties": {"grade": 'b'}},
      vectorLayer: polygon2,
      geometryType: 'MultiPolygon'
    });
    const vlp4 = this.store.createRecord('vectorLayerProject', {
      project,
      vectorLayer: polygon2,
      colorMap: {'A':{color: 'rgb(152, 0, 67)'}, 'B':{color: 'rgb(255, 20, 147)'}},
      order: 3,
      property: 'grade',
      marker: null
    });
    vectors.pushObject(vlp4);


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

  test('it shades polygon based on data colorMap', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    await settled();
    assert.dom('.shape-emory').hasStyle({
      fill: 'rgb(152, 0, 67)',
      fillOpacity: '0.3',
      strokeWidth: '3px'
    });
    assert.dom('.shape-oxford').hasStyle({
      fill: 'rgb(255, 20, 147)',
      fillOpacity: '0.3',
      strokeWidth: '3px'
    });
    await click('.shape-emory');
    assert.dom('.shape-emory').hasStyle({
      fillOpacity: '1',
      strokeWidth: '9px'
    });
  });

  test('it creates Leaflet panes for each vector layer', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-pane.leaflet-oxford-pane').exists();
  });

  test('it removes Leaflet pane for layer when `show` is false', async function(assert) {
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-pane.leaflet-emory-pane g path').exists();
    await this.model.get('vectors').forEach(v => {
      v.setProperties({ show: false });
    });
    await settled();
    assert.dom('.leaflet-pane.leaflet-emory-pane g path').doesNotExist();
  });
});
