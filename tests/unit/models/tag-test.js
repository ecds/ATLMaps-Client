import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('tag', {
  // Specify the other units that are required for this test.
  needs: ['model:layer', 'model:project', 'model:institution']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
