import { moduleFor, test } from 'ember-qunit';

moduleFor('route:project/base-layers', 'Unit | Route | project/base layers', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:sharable']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
