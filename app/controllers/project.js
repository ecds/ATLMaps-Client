import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

export default class ProjectController extends Controller {
  @service deviceContext;
  @service notification;
  @service searchParameters;
  @service searchResults;
  @service store;
  @service fastboot;

  setLimit(newLimit) {
    this.limit = newLimit;
  }

  @task
  *addRemoveRasterLayer(raster) {
    let projectRasters = yield this.model.project.sortedRasters;
    if (raster.leafletObject) {
      // raster.setProperties({ onMap: false });
      const rasterProject = this.store.peekAll('rasterLayerProject').findBy(
        'position', raster.leafletObject.options.zIndex
        );
        projectRasters.removeObject(rasterProject);
        rasterProject.deleteRecord();
        const elementToDelete = document.querySelectorAll(`[data-layer="${rasterProject.id}"]`);
        if (elementToDelete) {
          elementToDelete[0].remove();
        }
        let index = 10;
        projectRasters.forEach(raster => {
          raster.setProperties({
            position: index + projectRasters.length
          });
          index -= 1;
        });
        raster.setProperties({
          leafletObject: null
        });
        rasterProject.deleteRecord();
    } else {
      let newRaster = yield this.store.createRecord('raster-layer-project',
      {
        rasterLayer: raster,
        project: this.model.project
      });
      projectRasters.pushObject(newRaster);
      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      newRaster.setProperties({ position: this.model.project.rasters.length + 10 });
    }
  }

  @task
  *addRemoveVectorLayer(vector) {
    let projectVectors = yield this.model.project.vectors;
    if (vector.onMap) {
      const vectorProject = this.store.peekAll('vectorLayerProject').filter( vlp => {
        if (vlp.vectorLayer.get('id') == vector.id) {
          return vlp;
        }
      }).firstObject;
        projectVectors.removeObject(vectorProject);
      vectorProject.deleteRecord();
        // const elementToDelete = document.querySelectorAll(`[data-layer="${vectorProject.id}"]`);
        // if (elementToDelete) {
        //   elementToDelete[0].remove();
        // }
        // vectorProject.deleteRecord();
        vector.setProperties({ onMap: false });
    } else {
      let newVector = yield this.store.createRecord('vector-layer-project',
      {
        vectorLayer: vector,
        project: this.model.project
      });
      projectVectors.pushObject(newVector);
      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      newVector.setProperties({ position: this.model.project.vectors.length + 10 });
    }
  }
}
