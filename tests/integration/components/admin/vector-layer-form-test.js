import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin/vector-layer-form', 'Integration | Component | admin/vector layer form', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{admin/vector-layer-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#admin/vector-layer-form}}
      template block text
    {{/admin/vector-layer-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
