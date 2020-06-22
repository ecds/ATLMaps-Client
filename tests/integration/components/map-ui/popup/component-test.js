import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/popup', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('feature', this.server.create('vector-feature'));
    this.set('close', function(){});
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MapUi::Popup @activeFeature={{this.feature.attrs.properties}} @close={{this.close}} @closeKey={{this.close}} />`);

    assert.dom('h3.uk-card-title').hasText(this.feature.properties.name);

  });
});
