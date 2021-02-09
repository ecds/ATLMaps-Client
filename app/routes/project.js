import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class ProjectRoute extends Route {
  @service deviceContext;
  @service fastboot;

  model(params) {
    // Search results are loaded through the SearchResultsService.
    let project = null;
    if (this.fastboot.isFastBoot) {
      project = {};
    }
    else if (params.project_id == 'explore') {
      project = this.store.createRecord(
        'project',
        {
          name: 'Explore',
          mine: true,
          isExploring: true,
          description: 'Here you can view and layer maps and data and share links to individual layers without an account. To save and share a collection of layers, you must sign in.'
        }
      );
    } else {
      project = this.store.findRecord('project', params.project_id);
    }
    return RSVP.hash({
      project,
      categories: this.store.findAll('category')
    });
  }

  // beforeModel() {
  //   this.store.unloadAll('project');
  // }

  afterModel() {
    this.deviceContext.setDeviceContext();
  }
}
