import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { waitForProperty } from 'ember-concurrency';

export default class ProjectController extends Controller {
  @service colorBrewer;
  @service deviceContext;
  @service notification;
  @service fastboot;
  @service searchParameters;
  @service searchResults;
  @service session;
  @service store;

  @tracked vectorToAdd = null;
  @tracked currentAction = null;
  @tracked layerAddingOrRemoving = null;

  // setLimit(newLimit) {
  //   this.limit = newLimit;
  // }

  @task
  *addRemoveRasterLayer(raster) {
    if (!isNaN(raster)) {
      raster = this.store.peekRecord('rasterLayer', raster);
    }
    this.layerAddingOrRemoving = raster.title;
    let projectRasters = yield this.model.project.sortedRasters;
    let layerToEdit = null;
    if (raster.onMap) {
      this.currentAction = 'Removing';
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
      this.currentAction = 'Adding';
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
    this.layerAddingOrRemoving = null;
    this.currentAction = null;
  }

  @task
  *addRemoveVectorLayer(vector) {
    if (!isNaN(vector)) {
      vector = this.store.peekRecord('vectorLayer', vector);
    }
    this.layerAddingOrRemoving = vector.title;
    let projectVectors = yield this.model.project.vectors;
    let layerToEdit = null;
    if (vector.onMap) {
      this.currentAction = 'Removing';
      layerToEdit = this.store.peekAll('vectorLayerProject').filter( vlp => {
        if (vlp.vectorLayer.get('id') == vector.id) {
          return vlp;
        }
      }).firstObject;

      // Remove the layer from the map
      // We could call `invoke` on the layer group and remove, but this seems more clear.
      vector.leafletLayerGroup.eachLayer(layer => { layer.remove(); });

      projectVectors.removeObject(layerToEdit);

      switch(layerToEdit.dataType) {
        case 'qualitative':
          this.model.project.places.removeObject(layerToEdit);
        break;
        case 'quantitative':
      this.model.project.data.removeObject(layerToEdit);
          break;
      }


      layerToEdit.destroyRecord();
      vector.setProperties({ onMap: false });
      return true;
    } else {
      this.currentAction = "Adding";
      const tmpColor = vector.tmpColor;
      // The search results do not include the GeoJSON. So we need to get it.
      if (!vector.geojson) {
        vector = yield this.store.findRecord('vectorLayer', vector.id);
      }
      // Make extra sure we have the GeoJSON before trying to add it to the map.
      yield waitForProperty(vector, 'geojson');
      vector.setProperties({ tmpColor });
      layerToEdit = yield this.store.createRecord(
        'vector-layer-project',
        {
          vectorLayer: vector,
          project: this.model.project,
          show: false,
          color: tmpColor,
          dataType: vector.dataType,
          colorMap: vector.colorMap,
          property: vector.defaultBreakProperty
        }
        );

      if (vector.defaultBreakProperty && !vector.colorMap) {
        layerToEdit.setProperties({
          colorMap: A([]),
          property: vector.defaultBreakProperty,
          steps: 5,
          brewerGroup: 'sequential',
          brewerScheme: Object.keys(this.colorBrewer.sequential())[Math.floor(Math.random() * 19)]
        });
      }

      if (this.model.project.mayEdit) {
        yield layerToEdit.save();
      }

      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      layerToEdit.setProperties(
        {
          position: this.model.project.vectors.length + 10,
          show: true
        }
      );

      vector.setProperties({ onMap: true });
      projectVectors.pushObject(layerToEdit);


      this.fitBounds(vector);
      if (vector.dataType == 'quantitative' && !vector.colorMap && this.model.project.mayEdit) {
        this.vectorToAdd = { vectorLayer: vector, vectorProject: layerToEdit };
      }
    }
    if (this.model.project.mayEdit) {
      yield layerToEdit.save();
      yield this.saveProject.perform();
    }
    switch(layerToEdit.dataType) {
      case 'qualitative':
        // this.model.project.get('places').pushObject(layerToEdit);
        break;
      case 'quantitative':
        // this.model.project.get('data').pushObject(layerToEdit);
        break;
    }
    this.layerAddingOrRemoving = null;
    this.currentAction = null;
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
