import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('init-project-ui', 'Integration | Component | init project ui', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{init-project-ui}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#init-project-ui}}
      template block text
    {{/init-project-ui}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
