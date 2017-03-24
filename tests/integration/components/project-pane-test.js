import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('project-pane', 'Integration | Component | project pane', {
    integration: true,
    beforeEach(assert) {
       this.container
         .registry
         .registrations['helper:route-action'] = Ember.Helper.helper((arg) => {
           return this.routeActions[arg];
         });
       this.routeActions = {
         doSomething(arg) {
           return Ember.RSVP.resolve({arg});
         },
       };
     }
  });

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{project-pane}}`);

  assert.notEqual(this.$().text().trim(), '');
});
