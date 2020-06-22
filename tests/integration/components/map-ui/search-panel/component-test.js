import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/search-panel', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('project', this.server.create('project'));
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MapUi::SearchPanel @model={{hash project=this.project}} />`);

    assert.notEqual(this.element.textContent.trim(), '');

  });
});
