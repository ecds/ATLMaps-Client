import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/edit-panel', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const project = this.store.createRecord(
      'project',
      {
        centerLat: 33.7576709,
        centerLng : -84.37826157,
        zoomLevel: 16,
        defaultBaseMap: 'street',
        name: 'Burritos are Yummy',
        description: 'I really like burritos.',
        published: false,
        leafletMap: null
      }
    );

    this.set('project', project);

    this.set('setMap', event => {
      project.setProperties({'leafletMap': event.target });
    });
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::EditPanel @project={{this.project}} />`);
    assert.dom('form').containsText('Edit Project Title');
  });

  test('it updates project properties', async function(assert) {
    await render(hbs`<ProjectUi::EditPanel @project={{this.project}} />`);
    assert.dom('#project-title').hasValue(this.project.name);
    assert.dom('#project-description').hasValue(this.project.description);
    assert.dom('#project-published').isNotChecked();
    assert.dom('#project-latitude').hasValue(`${this.project.centerLat}`);
    assert.dom('#project-longitude').hasValue(`${this.project.centerLng}`);
    assert.dom('#zoom-level').hasValue(`${this.project.zoomLevel}`);
    assert.dom('#set-base-map-street').isChecked();

    await fillIn('#project-title', 'Bell Street Burritos are the Best');
    assert.equal(this.project.name, 'Bell Street Burritos are the Best');
    await fillIn('#project-description', 'I still love burritos.');
    assert.equal(this.project.description, 'I still love burritos.');
    await click('#project-published');
    assert.dom('#project-published').isChecked();
    await fillIn('#project-latitude', '01234');
    assert.equal(this.project.centerLat, '01234');
    await fillIn('#project-longitude', '56789');
    assert.equal(this.project.centerLng, '56789');
    await fillIn('#zoom-level', '11');
    assert.dom('#zoom-level').hasValue('11');
    await click('#set-base-map-satellite');
    assert.equal(this.project.defaultBaseMap, 'satellite');
  });

  test('it updates project map defaults based on current map position', async function(assert) {
    await render(hbs`<ProjectUi::EditPanel @project={{this.project}} /> <LeafletMap @lat={{this.project.centerLat}} @lng={{this.project.centerLng}} @zoom={{this.project.zoomLevel}} @onLoad={{this.setMap}} />`);
    this.project.leafletMap.setView([33.8, -84.4], 18);
    await click('#update-map-defaults');
    assert.equal(this.project.centerLat, 33.8);
    assert.equal(this.project.centerLng, -84.4);
    assert.equal(this.project.zoomLevel, 18);
  });
});
