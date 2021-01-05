import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProjectsRoute extends Route {
  @service store;

  async model() {
    return this.store.findAll('project');
  }
}
