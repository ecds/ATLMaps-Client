import { moduleFor, test } from 'ember-qunit';

moduleFor('route:tagem', 'Unit | Route | tagem', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:sharable']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
