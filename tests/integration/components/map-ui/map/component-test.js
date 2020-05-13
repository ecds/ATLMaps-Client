import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
// import MapComponent from 'atlmaps-client/components/map';
import ENV from 'atlmaps-client/config/environment';

// let map;

module('Integration | Component | map', function(hooks) {
  setupRenderingTest(hooks);
  
  test('it renders', async function(assert) {
    let store = this.owner.lookup('service:store');
    const project = store.createRecord('project');
    this.set('model', project);
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    assert.dom('.leaflet-container').exists();
    assert.dom('div#map-component span#center').hasText(`${ENV.APP.CENTER_LAT} : ${ENV.APP.CENTER_LNG}`);
    assert.dom('div#map-component span#zoom').hasText(ENV.APP.INITIAL_ZOOM.toString());

    // Template block usage:
    // await render(hbs`
    //   <Map>
    //     template block text
    //   </Map>
    // `);

    // assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('map has zoomControl at bottomLeft', async function(assert) {
    let store = this.owner.lookup('service:store');
    const project = store.createRecord('project');
    this.set('model', project);

    await render(hbs`<MapUi::Map @project={{this.model}} />`);
    // Leaflet's default is top left.
    assert.dom('div.leaflet-top.leaflet-left div.leaflet-control-zoom').doesNotExist();
    assert.dom('div.leaflet-bottom.leaflet-left div').hasClass('leaflet-control-zoom');
  });
});
