import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/search-panel/add-remove-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::SearchPanel::AddRemoveButton />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <ProjectUi::SearchPanel::AddRemoveButton>
        template block text
      </ProjectUi::SearchPanel::AddRemoveButton>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it shows add button for layer not on map', async function(assert) {
    this.set('layer', { onMap: false });
    await render(hbs`<ProjectUi::SearchPanel::AddRemoveButton @layer={{this.layer}} />`);
    await settled;
    assert.dom('button svg.fa-plus-circle.atlm-add-remove-icon').exists();
    assert.dom('button svg.fa-check-circle.atlm-add-remove-icon').doesNotExist();
  });

  test('it shows remove button for layer not on map', async function(assert) {
    this.set('layer', { onMap: true });
    await render(hbs`<ProjectUi::SearchPanel::AddRemoveButton @layer={{this.layer}} />`);
    await settled;
    assert.dom('button svg.fa-plus-circle.atlm-add-remove-icon').doesNotExist();
    assert.dom('button svg.fa-check-circle.atlm-add-remove-icon').exists();
  });


});
