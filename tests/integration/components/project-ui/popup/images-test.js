import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/popup/images', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('feature', this.server.create('vector-feature', 'withImages'));
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::Popup::Images @properties={{this.feature}} />`);
    const imageCount = findAll('img').length;
    assert.equal(imageCount, 4);
  });
});
