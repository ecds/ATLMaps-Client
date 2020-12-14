import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/popup/youtube', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('feature', this.server.create('vector-feature', 'withYoutube'));
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::Popup::Youtube @video={{this.feature.youtube}} />`);

    const iFrameSrc = find('iframe').src.replace(/\/$/, '');
    assert.equal(iFrameSrc, this.feature.youtube.replace(/\/$/, ''));

  });
});
