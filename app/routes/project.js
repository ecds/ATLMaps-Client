import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProjectRoute extends Route {
  @service deviceContext;

  model(params) {
    // Search results are loaded through the SearchResultsService.
    let project = null;
    if (params.project_id == 'explore') {
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

  @action
  willTransition() {
    // this.store.unloadAll('vectorLayerProject');
    // this.store.unloadAll('rasterLayerProject');
    // this.store.peekAll('vectorLayer').forEach( layer => {
    //   if (layer.get('hasDirtyAttributes')) {
    //     layer.rollBackAttributes();
    //   }
    // });

    // this.store.peekAll('vectorLayer').forEach((layer) => {
    //   console.log(layer.onMap);
    //   // layer.setProperties({ onMap: false });
    //   console.log(layer.onMap);
    // });

    // this.store.unloadRecord(this.currentModel.project);
  }

}
