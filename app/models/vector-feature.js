import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
// import L from 'leaflet';

export default class VectorFeatureModel extends Model {
  @attr('string') geometryType;
  @attr() properties;
  @attr() geojson;
  @attr('string') layerTitle;
  @attr('string') name;
  @attr('string') youtube;
  @attr('string') vimeo;
  @attr() images;
  @attr('string') image;
  @attr('string') description;
  // @attr() string;

  @attr('boolean', {
    defaultValue() {
      return false;
    }
  }) active;
  @attr() leafletObject;
  @attr() leafletMarker;
  @belongsTo('vectorLayer') vectorLayer;

  @computed('description')
  get safeDescription() {
    return htmlSafe(this.description);
  }

  @computed('vectorLayer.opacity', 'active')
  get opacity() {
    if (this.active) return 1;
    return this.vectorLayer.get('opacity') / 100;
  }

  @computed('vectorLayer.opacity', 'active')
  get weight() {
    if (this.active) return 9;
    if (this.opacity == 0) return 0;
    return 3;
  }

  @computed('color')
  get style() {
    if (typeof this.color == 'string') {
      return `color: ${this.color};`;
    }
    return `color: ${this.color.hex};`;
  }

  set style(style) {
    return style;
  }

  // @computed
  // get latLng() {
  //   if (this.geometryType == 'Point') {
  //     const [lng, lat] = this.geojson.geometries.firstObject.coordinates;
  //     return L.latLng(lat, lng);
  //   }
  //   return null;
  // }
}
