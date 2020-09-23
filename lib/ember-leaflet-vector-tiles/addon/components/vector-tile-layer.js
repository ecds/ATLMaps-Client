import BaseLayer from 'ember-leaflet/components/base-layer';
import { computed } from '@ember/object';
/* eslint-disable no-unused-vars */
// We have to import the VectorGrid plugin to make it available.
import * as VG from 'leaflet.vectorgrid';
/* eslint-enable no-unused-vars */
import L from 'leaflet';

export default class VectorTileLayerComponent extends BaseLayer {

  data = null;

  leafletRequiredOptions = ['url'];

  leafletOptions = [
    'renderFactory', 'vectorTileLayerStyles', 'interactive', 'getFeatureId',
    'tileSize', 'opacity', 'updateWhenIdle', 'updateWhenZooming', 'updateInterval',
    'zIndex', 'bounds', 'minZoom', 'maxZoom', 'maxNativeZoom', 'noWrap', 'pane',
    'className', 'keepBuffer', 'attribution', 'idProperty', 'styleFeatures', 'layerName',
    // Methods
    'bringToFront', 'bringToBack', 'getContainer', 'setOpacity', 'setZIndex',
    'isLoading', 'redraw', 'getTileSize'
  ];

  leafletEvents = [
    'add', 'loading', 'tileunload', 'tileloadstart', 'tileerror', 'tileload', 'load', 'click'
  ];

  leafletProperties = [
    'url:setUrl:noRedraw', 'zIndex', 'pane'
  ];

  @computed
  get options() {
    let styles = {};
    styles[this.layerName] = (properties, zoom, geometryDimension) => {
      return this.styleFeatures(properties, zoom, geometryDimension, ...arguments);
    };

    let options = {
      rendererFactory: L.svg.tile,
      interactive: true,
      vectorTileLayerStyles: styles,
      getFeatureId: function(f) {
        return f.properties[this.idProperty];
      }
    };

    this.leafletOptions.forEach(opt => {
      if (this[opt]) {
        options[opt] = this[opt];
      }
    });

    return options;
  }

  addToContainer() {
    if (!this._layer) return;
    if (!this.parentComponent._layer) return;
    this.parentComponent._layer.addLayer(this._layer);
  }

    // For Slicer, make this function `async`
    createLayer() {
    const layer = L.vectorGrid.protobuf(
      ...this.requiredOptions,
      this.options
    );
    return layer;
    // For Slicer NOTE: make this function `async`
    // let response = await fetch(this.url);
    // this.data = await response.json();
    // this._layer = L.vectorGrid.slicer(this.data, this.options);
    // this.addToContainer();
    // return this._layer;
  }
}
