import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/vector-panel/toggle-switch', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('project', { allVectorsHidden: false });
    await render(hbs`<MapUi::VectorPanel::ToggleSwitch />`);
    assert.equal(this.element.textContent.trim(), 'Hide all');

    this.set('project', { allVectorsHidden: true });
    await render(hbs`<MapUi::VectorPanel::ToggleSwitch @project={{this.project}} />`);
    assert.equal(this.element.textContent.trim(), 'Show all');
  });
});
