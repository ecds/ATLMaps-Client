import DS from 'ember-data';

import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('project', {
  // Specify the other units that are required for this test.
  needs: ['model:layer', 'model:tag', 'model:institution','model:raster-layer-project', 'model:vector-layer-project', 'model:raster-layer', 'model:vector-layer']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

 test('Project is a valid ember-data Model', function (assert) {
	// var store = this.store();
	var project = this.subject({name: 'Stadiumville', owner: 'Brennan Collins'});
	assert.ok(project);
	assert.ok(project instanceof DS.Model);
});
