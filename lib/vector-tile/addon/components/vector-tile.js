import BaseLayer from 'ember-leaflet/components/base-layer';
// import L, { vectorGrid, svg } from 'leaflet.vectorgrid';
// import L from 'leaflet.vectorgrid';
// import * as L from 'leaflet.vectorgrid';

export default class VectorTileComponent extends BaseLayer {

  leafletRequiredOptions = Object.freeze([]);

  leafletOption = Object.freeze([
    'renderFactory', 'vectorTileLayerStyles', 'interactive', 'getFeatureId',
    'tileSize', 'opacity', 'updateWhenIdle', 'updateWhenZooming', 'updateInterval',
    'zIndex', 'bounds', 'minZoom', 'maxZoom', 'maxNativeZoom', 'noWrap', 'pane',
    'className', 'keepBuffer', 'attribution',
    // Methods
    'bringToFront', 'bringToBack', 'getContainer', 'setOpacity', 'setZIndex',
    'isLoading', 'redraw', 'getTileSize'
  ]);

  leafletEvents = Object.freeze([
    'loading', 'tileunload', 'tileloadstart', 'tileerror', 'tileload', 'load'
  ]);

  leafletProperties = Object.freeze([
    'url:setUrl:noRedraw', 'zIndex', 'opacity'
  ])

  createLayer() {
    console.log("VectorTileComponent -> createLayer -> this.parentComponent._layer", this)
    return this.L.vectorGrid.protobuf(
      'https://geoserver.ecds.emory.edu/gwc/service/tms/1.0.0/OpenWorldAtlanta:Atlanta1928_RoadSystem@EPSG:900913@pbf/{z}/{x}/{-y}.pbf',
      {
        rendererFactory: this.L.svg.tile,
        interactive: true,
        vectorTileLayerStyles: {
            ATL1878_Railroads: {
              color: 'deeppink'
            }
        }
      }
    );
  }
}
