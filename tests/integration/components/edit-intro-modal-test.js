import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('edit-intro-modal', 'Integration | Component | edit intro modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{edit-intro-modal}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#edit-intro-modal}}
      template block text
    {{/edit-intro-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
