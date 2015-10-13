import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('reorder-layers', 'Integration | Component | reorder layers', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{reorder-layers}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#reorder-layers}}
      template block text
    {{/reorder-layers}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
