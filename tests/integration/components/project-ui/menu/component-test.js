import { module, test } from 'qunit';
import { click, render, settled, waitFor /*, waitUntil */ } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/menu', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    this.set('deviceContext', this.owner.lookup('service:deviceContext'));
    const project = this.store.createRecord('project', {
      name: 'Black Lives Matter',
      description: 'Why is that controversial?'
    });
    const projectWithRasters = this.store.createRecord('project');
    const projectWithVectors = this.store.createRecord('project');
    const vectorLayer = this.store.createRecord('vectorLayer', {
      show: true,
      dataType: 'qualitative'
    });
    const rasterLayer = this.store.createRecord('rasterLayer', {
      show: true
    });
    let rlp = this.store.createRecord('rasterLayerProject', {projectWithRasters, rasterLayer});
    let vlp = this.store.createRecord('vectorLayerProject', {projectWithVectors, vectorLayer, dataType: 'qualitative'});

    let withRasters = projectWithRasters.get('rasters');
    withRasters.pushObject(rlp);

    let withVectors = projectWithVectors.get('vectors');
    withVectors.pushObject(vlp);

    this.set('project', project);
    this.set('projectWithRasters', projectWithRasters);
    this.set('projectWithVectors', projectWithVectors);
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::Menu @project={{this.project}}/>`);
    await settled();
    await waitFor('.uk-open');
    assert.dom('#uk-accordion.uk-accordion').exists();
    assert.dom('.atlm-project-ui-project-menu-options.uk-tab').exists();
    assert.dom('#uk-accordion.uk-accordion li a.uk-accordion-title').hasText('Hide');
    assert.dom('.atlm-project-title h1').hasText(this.project.name);
    assert.dom('article.atlm-project-description').containsText(this.project.description);
    assert.dom('.atlm-raster-menu-button').doesNotExist();
    assert.dom('.atlm-vector-menu-button').doesNotExist();
  });

  test('it expands the menu when clicked', async function(assert) {
    await render(hbs`<ProjectUi::Menu @project={{this.project}}/>`);
    await settled();
    // Menu Shows
    assert.dom('li.main-menu-toggle').hasClass('uk-open');
    await settled();
    assert.dom(".uk-accordion-content.atlm-project-panel").doesNotHaveAttribute('hidden');
    // Menu hidden
    await click('#uk-accordion.uk-accordion li a.uk-accordion-title');
    await settled();
    assert.dom('.atlm-project-title').hasClass('uk-animation-slide-right-small');
    assert.dom('li.main-menu-toggle').doesNotHaveClass('uk-open');
    assert.dom('#uk-accordion.uk-accordion li a.uk-accordion-title').hasText('Show');
  });

  test('it shows raster menu option', async function(assert) {
    await render(hbs`<ProjectUi::Menu @project={{this.projectWithRasters}}/>`);
    assert.dom('.atlm-raster-menu-button').exists();
    await click('.atlm-raster-menu-button a');
    await waitFor('.atlm-panel-title');
    assert.dom('.atlm-panel-title').hasText('Map Layers');
  });

  test('it shows vector menu option', async function(assert) {
    await render(hbs`<ProjectUi::Menu @project={{this.projectWithVectors}}/>`);
    assert.dom('.atlm-vector-menu-button').exists();
    await click('.atlm-vector-menu-button a');
    await waitFor('.atlm-panel-title');
    assert.dom('.atlm-panel-title').hasText('Data Layers');
  });

  test('it shows buttons for mobile view', async function(assert) {
    this.deviceContext.setDeviceContext('mobile');
    await render(hbs`<ProjectUi::Menu @project={{this.project}}/>`);
    assert.dom('.atlm-project-ui-project-menu').doesNotExist();
    assert.dom('.atlm-mobile-project-menu').exists();
  });
});
