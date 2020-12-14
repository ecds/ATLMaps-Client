import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service fastboot;

  async model() {
    return this.store.findAll('project');
  }
}
