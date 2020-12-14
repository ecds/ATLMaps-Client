import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/base-layers', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::BaseLayers />`);

    assert.equal(findAll('li').length, 4);
  });

  test('it switches base layer', async function(assert) {
    let store = this.owner.lookup('service:store');
    const project = store.createRecord('project', {
      defaultBaseMap: 'street'
    });
    this.set('project', project);
    await render(hbs`<ProjectUi::BaseLayers @project={{this.project}} />`);
    assert.dom('li#base-street.active').exists();
    assert.equal(findAll('li.active').length, 1);
    await click('li#base-satellite button');
    assert.dom('li#base-satellite.active').exists();
    assert.equal(findAll('li.active').length, 1);
  });
});
