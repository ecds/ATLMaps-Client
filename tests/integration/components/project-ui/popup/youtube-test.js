import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/popup/youtube', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('video', 'https://youtu.be/lVehcuJXe6I');
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::Popup::Youtube @video={{this.video}} />`);

    const iFrameSrc = find('iframe').src.replace(/\/$/, '');
    assert.equal(iFrameSrc, 'https://www.youtube.com/embed/lVehcuJXe6I');

  });
});
