import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { A } from '@ember/array';

module('Unit | Controller | projects', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));

    const project1 = this.store.createRecord('project', {
      id: 1,
      name: 'project1',
      featured: false,
      published: true
    });

    const project2 = this.store.createRecord('project', {
      id: 2,
      name: 'project2',
      featured: false,
      published: false
    });

    this.set('controller', this.owner.lookup('controller:projects'));
    this.set('projects', A([project1, project2]));
  });

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    assert.ok(this.controller);
  });

  test('it updates sets an un-featured project to featured', function(assert) {
    assert.notOk(this.projects[0].featured);
    assert.ok(this.projects[0].published);
    this.controller.toggleFeatured(this.projects[0]);
    assert.ok(this.projects[0].featured);
    assert.ok(this.projects[0].published);
    this.controller.toggleFeatured(this.projects[0]);
    assert.notOk(this.projects[0].featured);
    assert.ok(this.projects[0].published);
  });

  test('it updates sets an un-featured project to featured and published', function(assert) {
    assert.notOk(this.projects[1].featured);
    assert.notOk(this.projects[1].published);
    this.controller.toggleFeatured(this.projects[1]);
    assert.ok(this.projects[1].featured);
    assert.ok(this.projects[1].published);
    this.controller.toggleFeatured(this.projects[1]);
    assert.notOk(this.projects[1].featured);
    assert.ok(this.projects[1].published);
  });
});
