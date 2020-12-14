import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/vector-panel', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const project = this.store.createRecord('project');
    let a = [1, 2, 3];
    a.forEach( i => {
      let vlp = this.store.createRecord(
        'vector-layer-project',
        {
          project,
          vectorLayer: this.store.createRecord('vectorLayer', {
            id: i,
            name: `layer-${i}`,
            leafletPane: { style: { zIndex: i }},
            dataType: 'qualitative',
            geometryType: 'Point'
          }),
          id: i,
          order: i,
          marker: i,
          colorMap: {}
        }
      );
      project.get('vectors').pushObject(vlp);
    });

    project.get('vectors').pushObject(
      this.store.createRecord('vector-layer-project', {
        project,
        vectorLayer: this.store.createRecord('vectorLayer', {
          id: 4,
          name: 'polygon',
          dataType: 'quantitative',
          geometryType: 'MultiPolygon',
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
        }),
        id: 4,
        order: 4,
        marker: 4,
        colorMap: [{ bottom: 111, top: 152, color: '#000000' }, { bottom: 153, top: 252, color: '#FFFFFF' }],
        property: 'prop1'
      })
    );

    this.set('project', project);
  });

  test('it renders', async function(assert) {
    const vector1 = await this.store.peekRecord('vector-layer', 1);
    vector1.setProperties({ geometryType: 'Point' });
    const vector2 = await this.store.peekRecord('vector-layer', 2);
    vector2.setProperties({ geometryType: 'LineString' });
    const vector3 = await this.store.peekRecord('vector-layer', 3);
    vector3.setProperties({ geometryType: 'MultiPolygon' });

    await render(hbs`<MapUi::VectorPanel @layers={{this.project.vectors}} />`);

    const vectorCount = findAll('.atlm-layer-list-item').length;
    assert.equal(vectorCount, this.project.vectors.length);

    assert.dom('li[data-layer="1"] svg.fa-map-marker-alt').exists();
    assert.dom('li[data-layer="2"] svg.fa-wave-square').exists();
    assert.dom('li[data-layer="3"] svg.fa-draw-polygon').exists();
    assert.dom('li[data-layer="1"] div[role="button"]').doesNotExist();
    // These elements were for reordering the vector layers. For now, they've been removed.
    // assert.dom('li[data-layer="2"] div[role="button"]').exists();
    // assert.dom('li[data-layer="3"] div[role="button"]').exists();
  });

  // Reordering vector layers have been removed for now.
  // test('it bumps layer to top', async function(assert) {
  //   await render(hbs`<MapUi::VectorPanel @project={{this.project}} />`);
  //   assert.dom('li[data-layer="2"] div[role="button"]').exists();
  //   await click('li[data-layer="2"] div[role="button"]');
  //   assert.dom('li[data-layer="2"] div[role="button"]').doesNotExist();
  // });

  test('it shows hidden layer', async function(assert) {
    await render(hbs`<MapUi::VectorPanel @layers={{this.project.vectors}} />`);
    await fillIn('input#opacity-layer-1', 0);
    assert.dom('input#opacity-layer-1').doesNotExist();
    await click('button#show-layer-1');
    assert.dom('input#opacity-layer-1').exists();
    assert.dom('input#opacity-layer-1').hasValue('100.1');
    await fillIn('input#opacity-polygon', 0);
    assert.dom('input#opacity-polygon').doesNotExist();
    await click('button#show-polygon');
    assert.dom('input#opacity-polygon').exists();
    assert.dom('input#opacity-polygon').hasValue('30.1');
  });

  test('it opens and closes color map editing modal', async function(assert) {
    this.project.setProperties({ mayEdit: true });
    await render(hbs`<div id="container"><MapUi::VectorPanel @project={{this.project}} @layers={{this.project.vectors}} @isTesting={{true}}/></div>`);
    await click('#data-layer-title-4');
    await click('#edit-colors-4');
    assert.dom('.uk-modal-title').exists();
    await click('#cancel-color-map');
    assert.dom('.uk-modal.uk-open').doesNotExist();
  });

  // test('it loads a pbf vector tile', async function(assert) {
  //   // this.set('pbf', fs.readFileSync('/Users/jay/data/ATLMaps-Client/tests/fixtures/4912.pbf'));
  //   await render(hbs`<div id="map"><LeafletMap @lat={{34}} @lng={{-84}} @zoom={{13}} as |layers|><layers.vectorTile @url="https://geoserver.ecds.emory.edu//gwc/service/tms/1.0.0/ATLMaps:Atlanta%20Neighborhoods@EPSG:900913@pbf/{z}/{x}/{-y}.pbf" /></LeafletMap></div>`);
  //   assert.equal(1, 1);
  // });
});
