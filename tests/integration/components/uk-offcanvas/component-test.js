import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { settled } from '@ember/test-helpers';

module('Integration | Component | uk-offcanvas', function(hooks) {
  setupRenderingTest(hooks);

  test('toggles on interactions', async function(assert) {
    await render(hbs`<button uk-toggle="target: #offcanvas">big boi</button><UkOffcanvas @id="offcanvas" />`);
    await settled();
    assert.dom('#off-canvas-container').exists();
    assert.dom('#offcanvas').exists();
    assert.dom('#offcanvas').doesNotHaveClass('uk-open');
  });
});
