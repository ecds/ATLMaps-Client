import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/vector-panel/toggle-switch', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const project = this.store.createRecord('project', { defaultBaseMap: 'street' });
    const vectorLayer = this.store.createRecord('vectorLayer', {
      show: true
    });
    const vectorLayer2 = this.store.createRecord('vectorLayer', {
      show: true
    });
    this.store.createRecord('vectorLayerProject', {project, vectorLayer});
    this.store.createRecord('vectorLayerProject', {project, vectorLayer: vectorLayer2});

    this.set('project', project);
  });

  test('it renders', async function(assert) {
    this.set('simpleProject', { allVectorsHidden: false });
    await render(hbs`<MapUi::VectorPanel::ToggleSwitch />`);
    assert.equal(this.element.textContent.trim(), 'Hide all');

    this.set('simpleProject', { allVectorsHidden: true });
    await render(hbs`<MapUi::VectorPanel::ToggleSwitch @project={{this.simpleProject}} />`);
    assert.equal(this.element.textContent.trim(), 'Show all');
  });

  test('it toggles the layers', async function(assert) {
    await render(hbs`<MapUi::VectorPanel::ToggleSwitch @project={{this.project}} />`);
    assert.equal(this.element.textContent.trim(), 'Hide all');
    await click('.atlm-toggle');
    assert.equal(this.element.textContent.trim(), 'Show all');
    await render(hbs`<MapUi::VectorPanel::ToggleSwitch @project={{this.project}} @status={{true}} />`);
    assert.equal(this.element.textContent.trim(), 'Show all');
    await click('.atlm-toggle');
    assert.equal(this.element.textContent.trim(), 'Hide all');
  });
});
