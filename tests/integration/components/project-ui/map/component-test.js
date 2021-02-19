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
      id: 1,
      name: 'reynoldstown',
      dataType: 'Point',
      geojson: {"type": "FeatureCollection","features": [{"type": "Feature","properties": {"title": "reynoldstown"},"geometry": {"type": "Point","coordinates": [-84.35593485832214,33.75110559588545]}}]},
      dataFormat: 'vector',
      onMap: true
    });
    const vlp = this.store.createRecord('vectorLayerProject', {
      id: 1,
      project, vectorLayer,
      marker: 1,
      order: 2,
      show: true
    });
    vectors.addObject(vlp);

    const vectorLayer2 = this.store.createRecord('vectorLayer', {
      id: 2,
      name: 'sweetwater',
      dataType: 'Point',
      geojson: {"type": "FeatureCollection","features": [{"type": "Feature","properties": {"title": "Five Points","description": "Historic center of Atlanta"},"geometry": {"type": "Point","coordinates": [-84.39003646373749,33.75457117356251]}}]},
      dataFormat: 'vector',
      onMap: true
    });
    const vlp2 = this.store.createRecord('vectorLayerProject', {
      id: 2,
      project,
      vectorLayer: vectorLayer2,
      order: 1,
      marker: 2,
      show: true
    });
    vectors.addObject(vlp2);

    const polygon1 = this.store.createRecord('vectorLayer', {
      id: 3,
      name: 'emory',
      dataType: 'MultiPolygon',
      geojson: {"type": "FeatureCollection","features": [{"type": "Feature","properties": {"title": "Woodruff Park","description": "Downtown park", "data": "2"},"geometry": {"type": "Polygon","coordinates": [[[-84.38957780599594,33.75454664293867],[-84.38853710889815,33.75453995276731],[-84.38792288303375,33.755717414886966],[-84.38849955797195,33.75621247935816],[-84.38957780599594,33.75454664293867]]]}}]},
      dataFormat: 'vector',
      onMap: true,
      opacity: 40
    });

    const vlp3 = this.store.createRecord('vectorLayerProject', {
      id: 3,
      project,
      vectorLayer: polygon1,
      colorMap: {'0':{top: 3, bottom: 1, color: 'rgb(152, 0, 67)'}, '2':{top: 6, bottom: 4, color: '#f7f4f9'}},
      order: 4,
      property: 'data',
      marker: null,
      show: true
    });
    vectors.addObject(vlp3);

    const polygon2 = this.store.createRecord('vectorLayer', {
      id: 4,
      name: 'oxford',
      dataType: 'MultiPolygon',
      geojson: {"type": "FeatureCollection","features": [{"type": "Feature","properties": {"title": "Emory Library","description": "library", "grade": "b"},"geometry": {"type": "Polygon","coordinates": [[[-84.32297587394714,33.79003065321512],[-84.32229459285736,33.79044081281942],[-84.32324409484863,33.79094013490301],[-84.32297587394714,33.79003065321512]]]}}]},
      dataFormat: 'vector',
      onMap: true,
      opacity: 40
    });

    const vlp4 = this.store.createRecord('vectorLayerProject', {
      id: 4,
      project,
      vectorLayer: polygon2,
      colorMap: {'A':{color: 'rgb(152, 0, 67)'}, 'B':{color: 'rgb(255, 20, 147)'}},
      order: 3,
      property: 'grade',
      marker: null,
      show: true
    });
    vectors.addObject(vlp4);

    this.set('model', project);
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-container').exists();
    assert.dom('.leaflet-tile-pane .base-street').exists();
    assert.dom('div#map-component span#center').hasText(`${ENV.APP.CENTER_LAT} : ${ENV.APP.CENTER_LNG}`);
    assert.dom('div#map-component span#zoom').hasText(ENV.APP.INITIAL_ZOOM.toString());

  });

  test('map has zoomControl at bottomLeft', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    // Leaflet's default is top left.
    assert.dom('div.leaflet-top.leaflet-left div.leaflet-control-zoom').doesNotExist();
    assert.dom('div.leaflet-bottom.leaflet-left div').hasClass('leaflet-control-zoom');
  });

  test('it adds layers to map', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-marker-icon').exists();
    // assert.dom('div.leaflet-reynoldstown-pane').exists();
    assert.dom('.raster-atlanta').exists();
  });

  test('it activates feature when marker clicked', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    await settled();
    assert.equal(findAll('.leaflet-marker-icon').length, 2);
    assert.dom('.leaflet-marker-icon.active').doesNotExist();
    await click('.leaflet-marker-icon');
    await settled();
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
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-tile-pane .raster-atlanta').exists();
  });

  test('it switches base map', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-tile-pane .base-street').exists();
    this.model.setProperties({ defaultBaseMap: 'satellite'});
    await settled();
    assert.dom('.leaflet-tile-pane .base-street').doesNotExist();
    assert.dom('.leaflet-tile-pane .base-satellite').exists();
  });

  test('it shades polygon based on data colorMap', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    await settled();
    assert.dom('.leaflet-vector-layer-3-pane path').hasStyle({
      fill: 'rgb(152, 0, 67)',
      fillOpacity: '0.4',
      strokeWidth: '1px'
    });
  });

  test('it highlights polygon when clicked', async function(assert) {
    await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
    await settled();
    await click('.leaflet-vector-layer-3-pane path');
    assert.dom('.leaflet-vector-layer-3-pane path').hasStyle({
      fill: 'rgb(152, 0, 67)',
      fillOpacity: '1',
      strokeWidth: '1px'
    });
  });

  // TODO: Fix this test
  // test('it creates Leaflet panes for each vector layer', async function(assert) {
  //   await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
  //   assert.dom('.leaflet-pane.leaflet-oxford-pane').exists();
  // });

  // test('it removes Leaflet pane for layer when `show` is false', async function(assert) {
  //   await render(hbs`<ProjectUi::Map @project={{this.model}} />`);
  //   assert.dom('.leaflet-pane.leaflet-emory-pane g path').exists();
  //   await this.model.get('vectors').forEach(v => {
  //     v.setProperties({ show: false });
  //   });
  //   await settled();
  //   assert.dom('.leaflet-pane.leaflet-emory-pane g path').doesNotExist();
  // });
});
