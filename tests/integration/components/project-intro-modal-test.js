import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('project-intro-modal', 'Integration | Component | project intro modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{project-intro-modal}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#project-intro-modal}}
      template block text
    {{/project-intro-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
