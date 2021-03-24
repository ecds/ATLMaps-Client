import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-ui/search-panel/filters/providers', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const institutions = [
      this.store.createRecord('institution', {
        id: 1,
        name: 'Bumfuzzle'
      }),
      this.store.createRecord('institution', {
        id: 2,
        name: 'Cattywampus'
      })
    ];

    this.set('institutions', institutions);

  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectUi::SearchPanel::Filters::Providers @providers={{this.institutions}} />`);
    assert.equal(this.element.querySelector('#provider-1').value, '1');
    assert.equal(this.element.querySelector('#provider-2').value, '2');
    assert.dom('#provider-1').hasText('Bumfuzzle');
  });
});
