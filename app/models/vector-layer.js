import LayerModel from './layer';
import { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class VectorLayerModel extends LayerModel {
  @service colorBrewer;
  @service store;

  @attr('string', {
    defaultValue() { return 'Point'; }
  }) geometryType;
  @attr('string') propertyId;
  @attr('string') defaultBreakProperty;
  @attr('string') tmpColor;
  @attr('string') dataType;
  @attr() properties;
  @attr() geojson;
  @attr() colorMap;
  @hasMany('vectorLayerProject') vectorLayerProjects;

  @attr( {
    defaultValue() { return []; }
  }) leafletFeatures;

  @attr( {
    defaultValue() { return []; }
  }) leafletMarkers;

  @computed('geometryType')
  get opacity() {
    if (this.geometryType.includes('Polygon') || this.geometryType == 'GeometryCollection') return 40;
    return 100;
  }

  set opacity(num) {
    return num;
  }

  @computed('opacity')
  get show() {
    if (this.opacity == 0) return false;
    return true;
  }

  set show(value) {
    if (value == false) {
      this.setProperties({ opacity: 0 });
      return value;
    }
    return value;
  }

  @computed('geojson')
  get vectorFeatures() {
    let features = [];
    this.geojson.features.forEach((feature, index) => {
      let geometryType = null;
      if (feature.geometry) {
        geometryType = feature.geometry.type;
      } else {
        geometryType = feature.geometries.firstObject.type;
      }
      let _vectorFeature = this.store.peekRecord('vectorFeature', this.id + index);
      if (!_vectorFeature) {
        _vectorFeature = this.store.createRecord(
          'vectorFeature',
          {
            id: this.id + index,
            geojson: feature,
            geometryType,
            layerTitle: this.title,
            vectorLayer: this
          }
        );
      }
      features.push(_vectorFeature);
    });
    return features;
  }

  @computed('description')
  get safeDescription() {
    return htmlSafe(this.description);
  }

  @computed('geometryType')
  get icon() {
    if (!this.geometryType) return null;
    if (this.dataType == 'quantitative') return 'database';
    if (this.geometryType.includes('Polygon')) return 'draw-polygon';
    if (this.geometryType.includes('LineString')) return 'wave-square';
    return 'map-marker-alt';
  }

  @computed('geometryType')
  get isPoints() {
    return this.geometryType.includes('Point');
  }

  @computed('geometryType')
  get isOpaque() {
    return this.isPoints || this.geometryType.includes('Line');
  }

  @computed('tmpColor')
  get tmpStyle() {
    return htmlSafe(`color: ${this.tmpColor}`);
  }

  @computed('tmpColor')
  get color() {
    return this.tmpColor;
  }

  @computed
  get property() {
    return this.defaultBreakProperty;
  }



  // Specific properties for VectorTile Layers

  // @computed('properties', 'propertyId')
  // get vectorTilePropertyIds() {
  //   if (this.dataFormat != 'pbf') return null;
  //   return this.properties.find(p => Object.keys(p).includes(this.propertyId))[this.propertyId]
  // }

  // @computed('leafletLayerGroup')
  // get onMap() {
  //   return this.leafletLayerGroup.getLayers().length > 0;
  // }
}
