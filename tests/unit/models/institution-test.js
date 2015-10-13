import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('institution', {
  // Specify the other units that are required for this test.
  needs: ['model:layer', 'model:user', 'model:project', 'model:tag']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
