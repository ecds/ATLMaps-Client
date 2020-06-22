import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class ProjectRoute extends Route {
  @service deviceContext;

  model(params) {
    // Search results are loaded through the SearchResultsService.
    return RSVP.hash({
      project: this.store.find('project', params.project_id),
      categories: this.store.findAll('category')
    });
  }

  afterModel() {
    this.deviceContext.setDeviceContext();
  }
}
