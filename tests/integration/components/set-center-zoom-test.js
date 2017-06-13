import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('set-center-zoom', 'Integration | Component | set center zoom', {
  integration: true
});

test('it renders', function(assert) {

    this.render(hbs`{{set-center-zoom}}`);

    assert.notEqual(this.$().text().trim(), '');
});
