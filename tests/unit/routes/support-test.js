import { moduleFor, test } from 'ember-qunit';

moduleFor('route:support', 'Unit | Route | support', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:sharable']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
