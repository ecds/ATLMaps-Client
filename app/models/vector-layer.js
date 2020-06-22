import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

// import L from 'leaflet';

export default class VectorLayerModel extends Model {
  @service dataColors;

  @attr('string') title;
  @attr('string') name;
  @attr('string') description;
  @attr('string') dataType;
  @attr('string') url;
  @attr('boolean', {
    defaultValue() { return false; }
  }) onMap;
  @belongsTo('institution') institution;
  @hasMany('vectorLayerProject') vectorLayerProjects;
  @hasMany('vectorFeature') vectorFeatures;

  @computed('dataType')
  get opacity() {
    if (this.dataType == 'MultiPolygon') return 30;
    return 100;
  }

  set opacity(num) {
    return num;
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

  // @computed
  // get leafletLayerGroup() {
  //   return L.layerGroup();
  // }

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

  // @computed('leafletLayerGroup')
  // get onMap() {
  //   return this.leafletLayerGroup.getLayers().length > 0;
  // }
}
