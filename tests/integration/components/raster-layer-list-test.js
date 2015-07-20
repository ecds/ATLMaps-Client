import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('raster-layer-list', 'Integration | Component | raster layer list', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{raster-layer-list}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#raster-layer-list}}
      template block text
    {{/raster-layer-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
