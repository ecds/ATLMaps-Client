import Ember from 'ember';
import MapLayerMixin from 'atlmaps/mixins/map-layer';
import { module, test } from 'qunit';

module('Unit | Mixin | map layer');

// Replace this with your real tests.
test('it works', function(assert) {
  let MapLayerObject = Ember.Object.extend(MapLayerMixin);
  let subject = MapLayerObject.create();
  assert.ok(subject);
});
