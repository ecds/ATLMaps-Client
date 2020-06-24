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
            leafletPane: { style: { zIndex: i }}
          }),
          id: i,
          order: i,
          marker: i
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
          dataType: 'MultiPolygon'
        }),
        order: 4,
        marker: 4
      })
    );

    this.set('project', project);
  });

  test('it renders', async function(assert) {
    const vector1 = await this.store.peekRecord('vector-layer', 1);
    vector1.setProperties({ dataType: 'Point' });
    const vector2 = await this.store.peekRecord('vector-layer', 2);
    vector2.setProperties({ dataType: 'LineString' });
    const vector3 = await this.store.peekRecord('vector-layer', 3);
    vector3.setProperties({ dataType: 'MultiPolygon' });

    await render(hbs`<MapUi::VectorPanel @project={{this.project}} />`);

    const vectorCount = findAll('.atlm-layer-list-item').length;
    assert.equal(vectorCount, 4);

    assert.dom('li[data-layer="1"] svg.fa-map-marker-alt').exists();
    assert.dom('li[data-layer="2"] svg.fa-wave-square').exists();
    assert.dom('li[data-layer="3"] svg.fa-draw-polygon').exists();
    assert.dom('li[data-layer="1"] div[role="button"]').doesNotExist();
    assert.dom('li[data-layer="2"] div[role="button"]').exists();
    assert.dom('li[data-layer="3"] div[role="button"]').exists();
  });

  test('it bumps layer to top', async function(assert) {
    await render(hbs`<MapUi::VectorPanel @project={{this.project}} />`);
    assert.dom('li[data-layer="2"] div[role="button"]').exists();
    await click('li[data-layer="2"] div[role="button"]');
    assert.dom('li[data-layer="2"] div[role="button"]').doesNotExist();
  });

  test('it shows hidden layer', async function(assert) {
    // await this.project.get('vectors').forEach(vlp => {
    //   vlp.get('vectorLayer').setProperties({ opacity: 0 });
    // });
    await render(hbs`<MapUi::VectorPanel @project={{this.project}} />`);
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
});
