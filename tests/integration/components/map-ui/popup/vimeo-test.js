import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/popup/vimeo', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('feature', this.server.create('vector-feature', 'withVimeo'));
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::Popup::Vimeo @video={{this.feature.vimeo}} />`);

    const iFrameSrc = find('iframe').src.replace(/\/$/, '');
    assert.equal(iFrameSrc, this.feature.vimeo.replace(/\/$/, ''));

  });
});
