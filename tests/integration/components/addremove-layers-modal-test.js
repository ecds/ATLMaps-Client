import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('addremove-layers-modal', 'Integration | Component | addremove layers modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{addremove-layers-modal}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#addremove-layers-modal}}
      template block text
    {{/addremove-layers-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
