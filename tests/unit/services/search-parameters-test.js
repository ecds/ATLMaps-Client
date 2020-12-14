import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | search-parameters', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.set('service', this.owner.lookup('service:search-parameters'));
    this.service.currentBounds = {
      getSouth: function() { return 1; },
      getNorth: function() { return 2; },
      getEast: function() { return 3; },
      getWest: function() { return 4; }
    };
  });

  test('it sets the bounds to be searched', function(assert) {
    this.service.setSearchBounds();
    assert.equal(this.service.bounds.s, 1);
    assert.equal(this.service.bounds.n, 2);
    assert.equal(this.service.bounds.e, 3);
    assert.equal(this.service.bounds.w, 4);
  });


});
