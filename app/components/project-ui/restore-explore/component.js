import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';

export default class ProjectUiRestoreExploreComponent extends Component {
  @service exploreProject;
  @service store;

  @action
  restoreLayers() {
    this.addLayers.perform();
  }

  @action
  clearLayers() {
    this.exploreProject.clearLayers();
  }

  @task
  *addLayers() {
    yield this.exploreProject.layers.rasters.forEach(rasterId => {
      this.store.findRecord('rasterLayer', rasterId).then(raster => {
        this.args.addRaster.perform(raster);
      });
    });
    yield this.exploreProject.layers.vectors.forEach(vectorId => {
      this.store.findRecord('vectorLayer', vectorId).then(vector => {
        this.args.addVector.perform(vector);
      });
    });
  }
}
