import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('refill-accordion-sub', 'Integration | Component | refill accordion sub', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{refill-accordion-sub}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#refill-accordion-sub}}
      template block text
    {{/refill-accordion-sub}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
