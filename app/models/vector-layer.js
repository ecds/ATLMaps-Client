import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class VectorLayerModel extends Model {
  @service dataColors;
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
  @attr('string') dataType;
  @attr('string') dataFormat;
  @attr('string') workspace;
  @attr('string') geoUrl;
  @attr('string') propertyId;
  @attr('string') url;
  @attr() properties;
  @attr() maxx;
  @attr() maxy;
  @attr() minx;
  @attr() miny;
  @attr() geojson;
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

  @computed('dataType')
  get opacity() {
    if (this.dataType == 'MultiPolygon') return 40;
    return 100;
  }

  set opacity(num) {
    return num;
  }

  @computed('geojson')
  get vectorFeatures() {
    let features = [];
    this.geojson.features.forEach((feature, index) => {
    console.log("VectorLayerModel -> getvectorFeatures -> feature", feature)
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
            description: feature.properties.description,
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

  @computed('dataType')
  get icon() {
    if (this.dataType == 'MultiPolygon') return 'draw-polygon';
    if (this.dataType == 'LineString') return 'wave-square';
    return 'map-marker-alt';
  }

  @computed
  get leafletLayerGroup() {
    if (this.fastboot.isFastBoot) return null;
    return this.L.layerGroup();
  }

  @computed('dataType')
  get tempColorIndex() {
    if (this.dataType == 'Point') {
      return parseInt(Math.random() * this.dataColors.markerColors.length);
    }
      return parseInt(Math.random() * this.dataColors.shapeColors.length);
  }

  @computed('tempColorIndex')
  get tempColor() {
    if (this.dataType == 'Point') {
      return this.dataColors.markerColors[this.tempColorIndex];
    }
    return this.dataColors.shapeColors[this.tempColorIndex];
  }

  set tempColor(color) {
    return color;
  }

  @computed('minx', 'maxx', 'miny', 'maxy')
  get latLngBounds() {
    if (this.fastboot.isFastBoot) return null;
    if ([this.maxx, this.maxy, this.minx, this.miny].any(prop => prop == null )) return null;
    return this.L.latLngBounds(
      this.L.latLng(this.maxy, this.maxx),
      this.L.latLng(this.miny, this.minx)
    );
  }

  // @computed('leafletLayerGroup')
  // get onMap() {
  //   return this.leafletLayerGroup.getLayers().length > 0;
  // }
}
