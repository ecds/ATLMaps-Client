import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | color-brewer', function(hooks) {
  setupTest(hooks);


  test('it exists', function(assert) {
    let service = this.owner.lookup('service:color-brewer');
    assert.ok(service);
    let group = service.getGroup('diverging', 4);
    assert.equal(group['PiYG'].length, 4);
    group = service.getGroup('qualitative', 7);
    assert.equal(group['Paired'].length, 7);
    group = service.getGroup('sequential', 8);
    assert.equal(group['Purples'].length, 8);
  });
});
