import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('layer', {
  // Specify the other units that are required for this test.
  needs: ['model:project', 'model:tag', 'model:institution', 'model:user' ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
