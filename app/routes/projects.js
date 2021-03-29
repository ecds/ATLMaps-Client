import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProjectsRoute extends Route {
  @service store;
  @service headData;

  async model() {
    return this.store.findAll('project');
  }

  afterModel() {
    this.headData.title = 'Projects: ATLMaps';
  }
}
