import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('vector-layer-option-panel', 'Integration | Component | vector layer option panel', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{vector-layer-option-panel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#vector-layer-option-panel}}
      template block text
    {{/vector-layer-option-panel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
