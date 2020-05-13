import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProjectRoute extends Route {
  @service store;

  async model(params) {
    return this.store.find('project', params.project_id);
  }
}
