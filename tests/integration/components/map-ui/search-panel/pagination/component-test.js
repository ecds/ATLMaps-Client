import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | map-ui/search-panel/pagination', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<MapUi::SearchPanel::Pagination />`);
    assert.dom('ul.uk-pagination').exists();
  });
  
  test('first page of results', async function(assert) {
    
    this.set('meta', {
      current_page: '1',
      next_page: '2',
      prev_page: null,
      total_count: '2945',
      total_pages: '59'
    });
    
    await render(hbs`<MapUi::SearchPanel::Pagination @meta={{this.meta}} />`);
    assert.dom('ul.uk-pagination').exists();
    assert.dom('li.atlm-test-first-page').doesNotExist();
    assert.dom('li.atlm-test-first-ellipsis').doesNotExist();
    assert.dom('li.atlm-test-prev-page').doesNotExist();
    assert.dom('li.atlm-test-current-page').exists();
    assert.dom('li.atlm-test-current-page button').hasText(this.meta.current_page);
    assert.dom('li.atlm-test-next-page').exists();
    assert.dom('li.atlm-test-next-page').hasText(this.meta.next_page);
    assert.dom('li.atlm-test-last-ellipsis').exists();
    assert.dom('li.atlm-test-last-page').exists();
    assert.dom('li.atlm-test-last-page').hasText(this.meta.total_pages);
  });

  test('second page of results', async function(assert) {
    
    this.set('meta', {
      current_page: '2',
      next_page: '3',
      prev_page: '1',
      total_count: '2945',
      total_pages: '59'
    });
    
    await render(hbs`<MapUi::SearchPanel::Pagination @meta={{this.meta}} />`);
    assert.dom('ul.uk-pagination').exists();
    assert.dom('li.atlm-test-first-page').doesNotExist();
    assert.dom('li.atlm-test-first-ellipsis').doesNotExist();
    assert.dom('li.atlm-test-prev-page').exists();
    assert.dom('li.atlm-test-prev-page').hasText(this.meta.prev_page);
    assert.dom('li.atlm-test-current-page').exists();
    assert.dom('li.atlm-test-current-page button').hasText(this.meta.current_page);
    assert.dom('li.atlm-test-next-page').exists();
    assert.dom('li.atlm-test-next-page').hasText(this.meta.next_page);
    assert.dom('li.atlm-test-last-ellipsis').exists();
    assert.dom('li.atlm-test-last-page').exists();
    assert.dom('li.atlm-test-last-page').hasText(this.meta.total_pages);
  });

  test('fourth page of results', async function(assert) {
    
    this.set('meta', {
      current_page: '4',
      next_page: '5',
      prev_page: '3',
      total_count: '2945',
      total_pages: '59'
    });
    
    await render(hbs`<MapUi::SearchPanel::Pagination @meta={{this.meta}} />`);
    assert.dom('ul.uk-pagination').exists();
    assert.dom('li.atlm-test-first-page').exists();
    assert.dom('li.atlm-test-first-page').hasText('1');
    assert.dom('li.atlm-test-first-ellipsis').exists();
    assert.dom('li.atlm-test-prev-page').exists();
    assert.dom('li.atlm-test-prev-page').hasText(this.meta.prev_page);
    assert.dom('li.atlm-test-current-page').exists();
    assert.dom('li.atlm-test-current-page button').hasText(this.meta.current_page);
    assert.dom('li.atlm-test-next-page').exists();
    assert.dom('li.atlm-test-next-page').hasText(this.meta.next_page);
    assert.dom('li.atlm-test-last-ellipsis').exists();
    assert.dom('li.atlm-test-last-page').exists();
    assert.dom('li.atlm-test-last-page').hasText(this.meta.total_pages);
  });

  test('fourth last of results', async function(assert) {
    
    this.set('meta', {
      current_page: '59',
      next_page: null,
      prev_page: '58',
      total_count: '2945',
      total_pages: '59'
    });
    
    await render(hbs`<MapUi::SearchPanel::Pagination @meta={{this.meta}} />`);
    assert.dom('ul.uk-pagination').exists();
    assert.dom('li.atlm-test-first-page').exists();
    assert.dom('li.atlm-test-first-page').hasText('1');
    assert.dom('li.atlm-test-first-ellipsis').exists();
    assert.dom('li.atlm-test-prev-page').exists();
    assert.dom('li.atlm-test-prev-page').hasText(this.meta.prev_page);
    assert.dom('li.atlm-test-current-page').exists();
    assert.dom('li.atlm-test-current-page button').hasText(this.meta.current_page);
    assert.dom('li.atlm-test-next-page').doesNotExist();
    assert.dom('li.atlm-test-last-ellipsis').doesNotExist();
    assert.dom('li.atlm-test-last-page').doesNotExist();
  });
});
