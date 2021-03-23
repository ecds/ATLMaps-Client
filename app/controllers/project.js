import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { keepLatestTask, task } from 'ember-concurrency-decorators';
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
  @tracked transitioning = false;

  @task
  *addRemoveRasterLayer(raster) {
    if (!isNaN(raster)) {
      raster = this.store.peekRecord('rasterLayer', raster);
    }
    this.layerAddingOrRemoving = raster.title;
    let projectRasters = yield this.model.sortedRasters;
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
        project: this.model
      });
      raster.setProperties({ onMap: true });
      projectRasters.pushObject(layerToEdit);
      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      layerToEdit.setProperties({ position: this.model.rasters.length + 10 });
      this.fitBounds(raster);
    }
    if (this.model.mayEdit) {
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
    let projectVectors = yield this.model.vectors;
    let layerToEdit = null;
    if (vector.onMap) {
      this.currentAction = 'Removing';
      layerToEdit = this.store.peekAll('vectorLayerProject').filter( vlp => {
        if (vlp.vectorLayer.get('id') == vector.id && vlp.project.get('id') == this.model.id) {
          return vlp;
        }
      }).firstObject;

      // Remove the layer from the map
      // We could call `invoke` on the layer group and remove, but this seems more clear.
      // vector.leafletLayerGroup.eachLayer(layer => { layer.remove(); });

      projectVectors.removeObject(layerToEdit);

      switch(layerToEdit.dataType) {
        case 'qualitative':
          this.model.places.removeObject(layerToEdit);
        break;
        case 'quantitative':
      this.model.data.removeObject(layerToEdit);
          break;
      }


      layerToEdit.destroyRecord();
      vector.setProperties({ onMap: false });
      return true;
    } else {
      this.currentAction = "Adding";
      const tmpColor = vector.tmpColor;
      const pane = this.model.leafletMap.createPane(`vector-layer-${vector.id}`);
      pane.classList.add('leaflet-overlay-pane');
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
          project: this.model,
          show: false,
          color: tmpColor,
          dataType: vector.dataType,
          colorMap: vector.colorMap,
          property: vector.defaultBreakProperty,
          leafletPane: pane,
          order: this.model.vectors.length + 1
        }
      );

      pane.style.zIndex = layerToEdit.zIndex;

      if (vector.defaultBreakProperty && !vector.colorMap) {
        layerToEdit.setProperties({
          colorMap: A([]),
          property: vector.defaultBreakProperty,
          steps: 5,
          brewerGroup: 'sequential',
          brewerScheme: Object.keys(this.colorBrewer.sequential())[Math.floor(Math.random() * 19)]
        });
      }

      if (this.model.mayEdit) {
        yield layerToEdit.save();
      }

      // Don't set the position until after it has been added to the model.project.
      // For some reason, if you set it at creation, it screws up the reordering.
      layerToEdit.setProperties(
        {
          position: this.model.vectors.length + 10,
          show: true
        }
      );

      vector.setProperties({ onMap: true });
      projectVectors.pushObject(layerToEdit);


      this.fitBounds(vector);
      if (vector.dataType == 'quantitative' && !vector.colorMap && this.model.mayEdit) {
        this.vectorToAdd = { vectorLayer: vector, vectorProject: layerToEdit };
      }
    }
    if (this.model.mayEdit) {
      yield layerToEdit.save();
      yield this.saveProject.perform();
    }
    switch(layerToEdit.dataType) {
      case 'qualitative':
        // this.model.get('places').pushObject(layerToEdit);
        break;
      case 'quantitative':
        // this.model.get('data').pushObject(layerToEdit);
        break;
    }
    this.layerAddingOrRemoving = null;
    this.currentAction = null;
  }

  @keepLatestTask
  *saveProject() {
    try {
      yield this.model.save();
      // this.notification.setNote.perform(
      //   {
      //     note: 'Your changes have been saved.',
      //     type: 'success'
      //   }
      // );
    } catch(error) {
      if (error.errors[0].status == '401') {
        this.model.rollbackAttributes();
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
    const bounds = this.model.leafletMap.getBounds();
    const layerCenter = layer.latLngBounds.getCenter();
    bounds.extend(layer.latLngBounds);
    this.model.leafletMap.fitBounds(bounds);
    this.model.leafletMap.panTo(layerCenter);
  }

  @action
  cancelColorMap() {
    this.vectorToAdd = null;
  }
}
