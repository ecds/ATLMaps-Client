import {
    moduleForComponent,
    test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auth-check', 'Integration | Component | auth check', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs `{{auth-check}}`);

    assert.equal(this.$().text().trim(), '');

    // This will only pass if authenticated.
    // Template block usage:
    // this.render(hbs`
    //   {{#auth-check}}
    //     template block text
    //   {{/auth-check}}
    // `);
    //
    // assert.equal(this.$().text().trim(), 'template block text');
});
