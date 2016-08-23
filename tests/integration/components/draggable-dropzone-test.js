import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('draggable-dropzone', 'Integration | Component | draggable dropzone', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{draggable-dropzone}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#draggable-dropzone}}
      template block text
    {{/draggable-dropzone}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
