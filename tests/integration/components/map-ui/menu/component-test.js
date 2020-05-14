import { module, test } from 'qunit';
import { click, settled, waitFor /*, waitUntil */ } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import faker from 'faker';

module('Integration | Component | map-ui/menu', function(hooks) {
  setupRenderingTest(hooks);
  
  hooks.beforeEach(function() {
    let store = this.owner.lookup('service:store');
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraphs();
    this.set('project', store.createRecord('project', { name: title , description: description }));
    this.set('model', this.project);
  });

  test('it renders', async function(assert) {
    
    await render(hbs`<MapUi::Menu @project={{this.model}}/>`);
    await settled();
    await waitFor('.uk-tab');
    assert.dom('#uk-accordion.uk-accordion').exists();
    assert.dom('.map-ui-project-menu-options.uk-tab').exists();
    assert.dom('#uk-accordion.uk-accordion li a.uk-accordion-title').hasText('Hide Menu');
    assert.dom('.atl-project-title h3').hasText(this.model.name);
    assert.dom('article.atl-project-description').hasText(this.model.description);
  });

  test('menu expands when clicked', async function(assert) {
    await render(hbs`<MapUi::Menu @project={{this.model}}/>`);
    await settled();
    // Menu Shows
    assert.dom('li.main-menu-toggle').hasClass('uk-open');
    await settled();
    // assert.dom('.atl-project-title').doesNotHaveClass('uk-animation-reverse');
    assert.dom(".uk-accordion-content.atl-project-panel").doesNotHaveAttribute('hidden');
    // Menu hidden
    await click('#uk-accordion.uk-accordion li a.uk-accordion-title');
    await settled();
    assert.dom('.atl-project-title').hasClass('uk-animation-slide-right-small');
    assert.dom('li.main-menu-toggle').doesNotHaveClass('uk-open');
    assert.dom('#uk-accordion.uk-accordion li a.uk-accordion-title').hasText('Show Menu');
  });
});
