import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

export default class ProjectController extends Controller {
  @service deviceContext;
  @service notification;
  @service searchParameters;
  @service searchResults;
  @service store;
  @service fastboot;

  // setLimit(newLimit) {
  //   this.limit = newLimit;
  // }

  @task
  *addRemoveRasterLayer(raster) {
    let projectRasters = yield this.model.project.sortedRasters;
    let layerToEdit = null;
    if (raster.onMap) {
      raster.setProperties({ onMap: false });
      layerToEdit = this.store.peekAll('rasterLayerProject').findBy(
        'position', raster.leafletObject.options.zIndex
        );
        projectRasters.removeObject(layerToEdit);
        layerToEdit.deleteRecord();
        let offset = 10;
        projectRasters.forEach(raster => {
          raster.setProperties({
            position: offset + projectRasters.length
          });
          offset -= 1;
        });
        raster.setProperties({
          leafletObject: null
        });
    } else {
      layerToEdit = yield this.store.createRecord('raster-layer-project',
      {
        rasterLayer: raster,
        project: this.model.project
      });
      raster.setProperties({ onMap: true });
      projectRasters.pushObject(layerToEdit);
      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      layerToEdit.setProperties({ position: this.model.project.rasters.length + 10 });
      let bounds = this.model.project.leafletMap.getBounds();
      bounds.extend(raster.latLngBounds);
      this.model.project.leafletMap.fitBounds(bounds);
    }
    if (this.model.project.mayEdit) {
      yield layerToEdit.save();
      yield this.saveProject.perform();
    }
  }

  @task
  *addRemoveVectorLayer(vector) {
    let projectVectors = yield this.model.project.vectors;
    let layerToEdit = null;
    if (vector.onMap) {
      layerToEdit = this.store.peekAll('vectorLayerProject').filter( vlp => {
        if (vlp.vectorLayer.get('id') == vector.id) {
          return vlp;
        }
      }).firstObject;
        projectVectors.removeObject(layerToEdit);
      layerToEdit.deleteRecord();
        vector.setProperties({ onMap: false });
    } else {
      vector.setProperties({ onMap: true });
      layerToEdit = yield this.store.createRecord('vector-layer-project',
      {
        vectorLayer: vector,
        project: this.model.project
      });
      projectVectors.pushObject(layerToEdit);
      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      layerToEdit.setProperties({ position: this.model.project.vectors.length + 10 });
    }
    if (this.model.project.mayEdit) {
      yield layerToEdit.save();
      yield this.saveProject.perform();
    }
  }

  @task
  *saveProject() {
    try {
      yield this.model.project.save();
      this.notification.setNote.perform(
        {
          note: 'Your changes have been saved.',
          type: 'success'
        }
      );
    } catch(error) {
      if (error.errors[0].status == '401') {
        this.model.project.rollbackAttributes();
        this.notification.setNote.perform(
          {
            note: 'You do not have permission to edit this project.',
            type: 'danger'
          }
        );
      }
    }
  }
}
