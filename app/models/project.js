import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import ENV from 'atlmaps-client/config/environment';
import { inject as service } from '@ember/service';

export default class ProjectModel extends Model {
  @service baseMaps;

  @attr('string') name;
  @attr('string') description;
  @attr('string') intro;

  @attr('number', {
    defaultValue() { return ENV.APP.CENTER_LAT; }
  }) centerLat;

  @attr('number', {
    defaultValue() { return ENV.APP.CENTER_LNG; }
  }) centerLng;

  @attr('number', {
    defaultValue() { return ENV.APP.INITIAL_ZOOM; }
  }) zoomLevel;

  @attr('string', {
    defaultValue() { return ENV.APP.DEFAULT_BASE_MAP; }
  }) defaultBaseMap;

  @attr('boolean', {
    defaultValue() { return false; }
  }) published;

  @attr() leafletMap;

  @hasMany('rasterLayerProject') rasters;
  @hasMany('vectorLayerProject') vectors;

  @computed('defaultBaseMap')
  get base() {
    return this.baseMaps[this.defaultBaseMap];
  }

  set base(baseObj) {
    return baseObj;
  }

  @computed('rasters')
  get hasRasters() {
    return this.rasters.length > 0;
  }

  @computed('vectors')
  get hasVectors() {
    return this.vectors.length > 0;
  }

  @computed('rasters.@each.opacity')
  get allRastersHidden() {
    return this.get('rasters').isEvery('opacity', "0") || this.get('rasters').isEvery('opacity', 0);
  }

  @computed('vectors.@each.show')
  get allVectorsHidden() {
    return this.get('vectors').isEvery('show', false);
  }

  @sort('rasters', '_rasterPositionSort')
  sortedRasters;

  _rasterPositionSort = ['position:desc'];

  @sort('vectors', '_vectorOrderSort')
  sortedVectors;

  _vectorOrderSort = ['order:asc'];

  @sort('vectors', '_vectorReverseOrderSort')
  reverseVectors;

  _vectorReverseOrderSort = ['order:desc'];
}
