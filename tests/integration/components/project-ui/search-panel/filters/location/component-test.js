import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

class SearchParametersStub extends Service {
  @tracked
  updateBounds = false;

  @tracked
  searchBounds = false;

  setSearchBounds() {
    this.searchBounds = !this.searchBounds;
  }
}

module('Integration | Component | project-ui/search-panel/filters/location', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(/*assert*/) {
    this.owner.register('service:search-parameters', SearchParametersStub);
  });

  test('it toggles on click', async function(assert) {
    await render(hbs`<ProjectUi::SearchPanel::Filters::Location />`);
    assert.dom('button.uk-button svg').hasClass('fa-square');
    await click('button.uk-button');
    assert.dom('button.uk-button svg').hasClass('fa-check-square');
    await triggerKeyEvent('button.uk-button', 'keyup', 'Enter');
    assert.dom('button.uk-button svg').hasClass('fa-square');
  });

  test('it shows update button when updateBounds is true', async function(assert) {
    this.searchParametersService = this.owner.lookup('service:search-parameters');
    await render(hbs`<ProjectUi::SearchPanel::Filters::Location />`);
    assert.dom('button.uk-button-primary').doesNotExist();
    this.set('searchParametersService.updateBounds', true);
    assert.dom('button.uk-button-primary').hasText('Update Location Filter');
    await click('button.uk-button-primary');
    this.set('searchParametersService.updateBounds', false);
    assert.dom('button.uk-button-primary').doesNotExist();
  });
});
