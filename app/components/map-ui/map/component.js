import Component from '@glimmer/component';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import L from "leaflet";

export default class MapComponent extends Component {

  @service searchParameters;
  @service deviceContext;
  @service fastboot;

  @tracked activeFeature = null;
  @tracked activeVectorTile = null;
  @tracked baseLayer;
  @tracked map;
  @tracked mapLoaded = false;

  @action
  initMap(event) {
    const map = event.target;
    this.args.project.setProperties({
      leafletMap: map
    });
    if(this.deviceContext.isDesktop) {
      map.zoomControl.setPosition('bottomleft');
    } else {
      map.zoomControl.remove();
    }
    this.args.project.get('vectors').forEach(vector => {
      map.createPane(
        vector.get('vectorLayer.name')
      );
      let pane = map.getPane(vector.get('vectorLayer.name'));
      pane.style.zIndex = 500 - (vector.order * 10);
      pane.classList.add('leaflet-overlay-pane');
      vector.setProperties({
        leafletPane: pane
      });
    });
    this.map = map;
    this.captureBounds();
  }

  @action
  rasterAdded(raster, event) {
    raster.setProperties({ leafletObject: event.sourceTarget, onMap: true });
  }

  @action
  geoJsonAdded(vectorLayer, leafletLayer) {
    vectorLayer.get('leafletLayerGroup').addLayer(leafletLayer.target);
  }

  @action
  onEachFeature(vectorFeature, vector, feature, layer) {
    vectorFeature.get('vectorLayer').setProperties({ onMap: true });
    layer.on('click', () => {
      this.clearActiveFeature();
      vectorFeature.setProperties({
        active: true
      });
      this.activeFeature = vectorFeature;
    });

    layer.on('keyup', event => {
      if (event.originalEvent.key == 'Enter') {
        this.clearActiveFeature();
        this.activeFeature = vectorFeature;
        vectorFeature.setProperties({
          active: true
        });
     }
    });
  }

  @action
  addMarker(vectorFeature, vector, layer, feature/*, point*/) {
    if (vectorFeature.geometryType == 'Point') {
      let marker = L.marker(feature);
      vectorFeature.setProperties(
        {
          leafletMarker: marker,
          style: `color: ${vector.color};`
        }
      );
      vectorFeature.leafletMarker.setIcon(vectorFeature.divIcon);
      // This function has to return the marker object.
      return marker;
    }
  }

  @action
  clearActiveFeatureKey(event) {
    // if (!event || event.type != 'keyup') return;
    if (event && event.type == 'keyup' && event.key == 'Escape' || event.key == 'Enter' && event.target.id == 'atlm-close-popup-button') {
      this.clearActiveFeature();
    }
  }

  @action
  clearActiveFeature() {
    if (this.activeVectorTile) {
      this.deactivateVT();
    }

    if (this.activeFeature) {
      this.activeFeature.setProperties({
        active: false
      });
    }
    this.activeFeature = null;
  }

  @action
  captureBounds() {
    if (this.map) {
      this.searchParameters.currentBounds = this.map.getBounds();
    }
  }

  @action
  baseChange(newBaseLayer) {
    if (!this.baseLayer) {
      this.baseLayer = newBaseLayer;
    } else if (newBaseLayer != this.baseLayer) {
      this.baseLayer.leafletObjects.forEach(layer => {
        layer.remove();
      });
      this.baseLayer.leafletObjects = A([]);
      this.baseLayer = newBaseLayer;
    }
  }

  @task
  *baseChanged(event) {
    yield timeout(500);
    this.mapLoaded = true;
    this.baseLayer.leafletObjects.push(event.target);
  }

  @action
  styleVectorTile(layer, colorMap, properties) {
    layer.get('vectorLayer').setProperties({ onMap: true });
    let style = L.Path.prototype.options;
    const prop = layer.property;
    if (Object.keys(colorMap).length > 1) {

      Object.keys(colorMap).forEach(key => {
        if (isNaN(properties[prop]) && properties[prop] == key) {
          style = {
            color: 'lightgray',
            fillColor: colorMap[key].color,
            fill: true,
            fillOpacity: layer.get('vectorLayer.opacity') / 100
          };
        }
        else if (properties[prop] >= colorMap[key].bottom && properties[prop] <= colorMap[key].top) {
          style = {
            color: 'lightgray',
            fillColor: colorMap[key].color,
            fill: true,
            fillOpacity: layer.get('vectorLayer.opacity') / 100
          };
        }
      });
    }
    layer.vectorTileStyles.addObject(
      {
        id: properties[layer.get('vectorLayer.propertyId')],
        style
      }
    );
    return style;
  }

  @action
  loadVectorTile(vector, event) {
    vector.get('vectorLayer.leafletFeatures').push(event.target);
  }

  @action
  addVectorTileLayer(vector, event) {
    vector.get('vectorLayer').setProperties({ leafletObject: event.target });
  }

  @action
  activateVT(vector, event) {
    this.clearActiveFeature();
    let layer = EmberObject.create(event.layer);
    let propertyId = vector.get('vectorLayer.propertyId');

    layer.setProperties(
      {
        name: layer.properties[propertyId],
        layer: event.target,
        style: `color: ${event.layer.options.fillColor};`
      }
    );

    layer.vectorLayer = vector.get('vectorLayer');
    let style = layer.options;
    style.fillOpacity = 1;

    if (this.activeVectorTile) {
      event.target.resetFeatureStyle(this.activeVectorTile);
    }

    this.activeFeature = layer;

    this.activeVectorTile = layer.properties[propertyId];

    event.target.setFeatureStyle(
      event.layer.properties[propertyId],
      style
    );
  }

  deactivateVT() {
    this.activeFeature.layer.resetFeatureStyle(this.activeVectorTile);
    this.activeVectorTile = null;
  }
}