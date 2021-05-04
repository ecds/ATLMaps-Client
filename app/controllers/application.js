import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class ApplicationController extends Controller {
  @service ecdsSession;
  @service deviceContext;
  @service store;
  @service currentUser;
  @service fastboot;
  @service router;

  @task
  *newProject() {
    const project = yield this.store.createRecord(
      'project',
      {
        user: this.currentUser.user
      }
    );
    yield project.save();
    this.transitionToRoute('project', project.id);
  }

  @action
  signOut() {
    this.ecdsSession.invalidate();
  }
}
