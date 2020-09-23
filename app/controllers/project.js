import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { waitForProperty } from 'ember-concurrency';

export default class ProjectController extends Controller {
  @service deviceContext;
  @service notification;
  @service fastboot;
  @service searchParameters;
  @service searchResults;
  @service session;
  @service store;

  @tracked vectorToAdd = null;

  // setLimit(newLimit) {
  //   this.limit = newLimit;
  // }

  @task
  *addRemoveRasterLayer(raster) {
    if (!isNaN(raster)) {
      raster = this.store.peekRecord('rasterLayer', raster);
    }
    let projectRasters = yield this.model.project.sortedRasters;
    let layerToEdit = null;
    if (raster.onMap) {
      raster.setProperties({ onMap: false });
      layerToEdit = this.store.peekAll('rasterLayerProject').findBy(
        'position', raster.leafletObject.options.zIndex
        );
        projectRasters.removeObject(layerToEdit);
        layerToEdit.destroyRecord();
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
        return true;
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
      this.fitBounds(raster);
    }
    if (this.model.project.mayEdit) {
      yield layerToEdit.save();
      yield this.saveProject.perform();
    }
  }

  @task
  *addRemoveVectorLayer(vector) {
    if (!isNaN(vector)) {
      vector = this.store.peekRecord('vectorLayer', vector);
    }
    let projectVectors = yield this.model.project.vectors;
    let layerToEdit = null;
    if (vector.onMap) {
      layerToEdit = this.store.peekAll('vectorLayerProject').filter( vlp => {
        if (vlp.vectorLayer.get('id') == vector.id) {
          return vlp;
        }
      }).firstObject;

      // Remove the layer from the map
      // We could call `invoke` on the layer group and remove, but this seems more clear.
      vector.leafletLayerGroup.eachLayer(layer => { layer.remove(); });

      projectVectors.removeObject(layerToEdit);
      layerToEdit.destroyRecord();
      vector.setProperties({ onMap: false });
      return true;
    } else {
      // The search results do not include the GeoJSON. So we need to get it.
      if (!vector.geojson) {
        vector = yield this.store.findRecord('vectorLayer', vector.id);
      }
      // Make extra sure we have the GeoJSON before trying to add it to the map.
      yield waitForProperty(vector, 'geojson');
      vector.setProperties({ onMap: true });
      layerToEdit = yield this.store.createRecord('vector-layer-project',
      {
        vectorLayer: vector,
        project: this.model.project,
        colorMap: A([])
      });
      projectVectors.pushObject(layerToEdit);
      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      layerToEdit.setProperties({ position: this.model.project.vectors.length + 10 });

      this.fitBounds(vector);
      if (vector.dataType != 'Point') {
        this.vectorToAdd = { vectorLayer: vector, vectorProject: layerToEdit };
      }
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

  @action
  fitBounds(layer) {
    if (!layer.latLngBounds) return;
    let bounds = this.model.project.leafletMap.getBounds();
    bounds.extend(layer.latLngBounds);
    this.model.project.leafletMap.fitBounds(bounds);
  }

  @action
  cancelColorMap() {
    this.vectorToAdd = null;
  }
}
