import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/popup', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const feature = this.store.createRecord('vectorFeature', {
      geojson: { properties: { name: 'something smart' } },
      description: 'maybe not that smart',
      color: { name: 'pink', hex: 'noMatter' },
      vectorLayer: this.store.createRecord('vectorLayer', { dataType: 'Point' })
    });
    this.set('feature', feature);
    this.set('close', function(){});
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MapUi::Popup @activeFeature={{this.feature}} @close={{this.close}} @closeKey={{this.close}} />`);

    assert.dom('h3.uk-card-title').hasText(this.feature.geojson.properties.name);

  });
});
