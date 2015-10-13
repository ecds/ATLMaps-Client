import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('hide-all-raster-layers', 'Integration | Component | hide all raster layers', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hide-all-raster-layers}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#hide-all-raster-layers}}
      template block text
    {{/hide-all-raster-layers}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
