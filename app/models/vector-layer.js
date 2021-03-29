import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class VectorLayerModel extends Model {
  @service colorBrewer;
  @service fastboot;
  @service store;

  constructor() {
    super(...arguments);
    this.checkFastBoot();
  }

  // Dynamic import for FastBoot
  async checkFastBoot() {
    if (this.fastboot.isFastBoot) return;
    this.L = await import('leaflet');
  }

  @attr('string') title;
  @attr('string') name;
  @attr('string') description;
  @attr('string', {
    defaultValue() { return 'Point'; }
  }) geometryType;
  @attr('string') dataFormat;
  @attr('string') workspace;
  @attr('string') geoUrl;
  @attr('string') propertyId;
  @attr('string') url;
  @attr('string') defaultBreakProperty;
  @attr('string') tmpColor;
  @attr('string') dataType;
  @attr() properties;
  @attr() maxx;
  @attr() maxy;
  @attr() minx;
  @attr() miny;
  @attr() geojson;
  @attr() colorMap;
  @attr('boolean', {
    defaultValue() { return false; }
  }) onMap;
  @belongsTo('institution') institution;
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

  set show(set) {
    if (set == false) {
      this.setProperties({ opacity: 0 });
      return;
    }
    return set;
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

  // @computed().readOnly()
  // get leafletLayerGroup() {
  //   if (this.fastboot.isFastBoot) return null;
  //   if (!this.L) return null;
  //   return this.L.featureGroup();
  // }

  @computed('tmpColor')
  get tmpStyle() {
    return htmlSafe(`color: ${this.tmpColor}`);
  }

  @computed('tmpColor')
  get color() {
    return this.tmpColor;
  }

  @computed('minx', 'maxx', 'miny', 'maxy')
  get latLngBounds() {
    if (this.fastboot.isFastBoot) return null;
    if ([this.maxx, this.maxy, this.minx, this.miny].any(i => !i )) return null;
    return this.L.latLngBounds(
      this.L.latLng(this.maxy, this.maxx),
      this.L.latLng(this.miny, this.minx)
    );
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
