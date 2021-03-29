import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import L from 'leaflet';
import { library, icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default class VectorFeatureModel extends Model {
  @attr('string') geometryType;
  @attr() geojson;
  @attr('string') layerTitle;
  @attr('string') name;
  @attr('boolean', {
    defaultValue() {
      return false;
    }
  }) active;
  @attr() leafletObject;
  @belongsTo('vectorLayer') vectorLayer;

  @computed('vectorLayer.color')
  get color() {
    if (this.geojson.properties.color) {
      return this.geojson.properties.color;
    }
    return this.get('vectorLayer.color');
  }
  set color(value) {
    return value;
  }

  @computed('geojson')
  get safeDescription() {
    return htmlSafe(this.geojson.properties.description);
  }

  @computed('geojson')
  get images() {
    if (this.geojson.properties.images) return this.geojson.properties.images;
    if (this.geojson.properties.image) return [this.geojson.properties.image];
    return null;
  }

  @computed('color', 'opacity', 'weight')
  get style() {
    return {
      color: this.color,
      fillColor: this.color,
      weight: this.weight,
      fillOpacity: this.opacity
    };
  }
  set style(value) {
    return value;
  }

  @computed('style')
  get styleString() {
    return JSON.stringify(this.style).replace('{', '').replace('}', '').replace(/,/g, ';').replace(/"/g, '');
  }

  @computed('vectorLayer.opacity', 'active')
  get opacity() {
    if (this.active) return 1;
    return this.vectorLayer.get('opacity') / 100;
  }

  @computed('vectorLayer.opacity', 'active')
  get weight() {
    if (this.active) return 6;
    if (this.opacity == 0) return 0;
    if (this.geometryType.includes('Line')) {
      return 3;
    }
    return 1;
  }

  @computed
  get geometry() {
    return { lat: 0, lng: 0 };
  }
  set geometry(value) {
    return value;
  }

  @computed('geometry')
  get leafletMarker() {
    return L.marker(this.geometry);
  }

  @computed('style', 'active', 'leafletMarker')
  get divIcon() {
    if (this.geometryType != 'Point') return null;

    library.add(faMapMarkerAlt);
    const markerIcon = faIcon({ prefix: 'fas', iconName: 'map-marker-alt' });
    const html = `<span id="data-layer-${this.id}" style=${this.styleString};">${markerIcon.html[0]}</span>`;

    let classList = 'leaflet-marker-icon leaflet-div-icon leaflet-zoom-animated leaflet-interactive atlm-map-marker';

    if (this.active) {
      classList = `${classList} active`;
    }
    const newIcon = L.divIcon({
      html,
      className: classList
    });
    this.leafletMarker.setIcon(newIcon);
    return newIcon;
  }
}
