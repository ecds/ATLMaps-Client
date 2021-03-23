import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/intro-modal-edit', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('project', {intro: '', media: ''});
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ProjectUi::IntroModalEdit @project={{this.project}} />`);

    assert.dom('#media').hasNoValue('');
  });
});
