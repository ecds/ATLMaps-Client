import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/search-panel/filters/tags', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const categories = [
      this.store.createRecord('category', {
        name: Math.random().toString(36).substring(2, 15),
        slug: Math.random().toString(36).substring(2, 15)
      }),
      this.store.createRecord('category', {
        name: Math.random().toString(36).substring(2, 15),
        slug: Math.random().toString(36).substring(2, 15)
      })
    ];

    categories.forEach(category => {
      [1, 2, 3].forEach(() => {
        category.get('tags').pushObject(
          this.store.createRecord('tag', {
            name: Math.random().toString(36).substring(2, 15),
            slug: Math.random().toString(36).substring(2, 15)
          })
        );
      });
    });
    this.set('categories', categories);
  });

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::SearchPanel::Filters::Tags @categories={{this.categories}} />`);
    assert.equal(findAll('li').length, 8);
  });

  test('it toggles clicked', async function(assert) {
    await render(hbs`<MapUi::SearchPanel::Filters::Tags @categories={{this.categories}} />`);
    let tags = findAll('ul.uk-accordion-content li button');
    assert.dom('button svg').hasClass('fa-square');
    assert.dom('ul.uk-accordion-content li button svg').hasClass('fa-square');
    await click('button');
    assert.dom('button svg').hasClass('fa-check-square');
    tags.slice(0, 3).forEach(tag => {
      assert.dom(tag.querySelector('svg')).hasClass('fa-check-square');
    });
    await click('ul.uk-accordion-content li button');
    assert.dom('button svg').hasClass('fa-check-square');
    assert.dom('ul.uk-accordion-content li button svg').hasClass('fa-square');
    await click('ul.uk-accordion-content li button');
    await click(tags[0]);
    assert.dom(tags[0].querySelector('svg')).hasClass('fa-square');
    await click(tags[1]);
    assert.dom(tags[1].querySelector('svg')).hasClass('fa-square');
    await click(tags[2]);
    assert.dom(tags[2].querySelector('svg')).hasClass('fa-square');
    assert.dom('button svg').hasClass('fa-square');
   });

});
