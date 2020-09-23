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
  @attr('string') media;
  @attr('string') photo;

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
  }) mine;

  @attr('boolean', {
    defaultValue() { return false; }
  }) mayEdit;

  @attr('boolean', {
    defaultValue() { return false; }
  }) published;

  @attr('boolean', {
    defaultValue() { return false; }
  }) isExploring;

  @attr() leafletMap;
  @attr() introModal;

  @hasMany('rasterLayerProject') rasters;
  @hasMany('vectorLayerProject') vectors;

  @computed('defaultBaseMap')
  get _defaultBaseMap() {
    return this.baseMaps[this.defaultBaseMap];
  }

  set _defaultBaseMap(value) {
    return this.baseMaps[value];
  }

  // @computed('zoomLevel')
  // get _zoomLevel() {
  //   return this.zoomLevel;
  // }

  // set _zoomLevel(value) {
  //   return value;
  // }

  // @computed('centerLat')
  // get _centerLat() {
  //   return this.centerLat;
  // }

  // set _centerLat(value) {
  //   return value;
  // }

  // @computed('centerLng')
  // get _centerLng() {
  //   return this.centerLng;
  // }

  // set _centerLng(value) {
  //   return value;
  // }

  // set base(baseObj) {
  //   return baseObj;
  // }

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

  @computed('name', 'description', 'published', 'centerLat', 'centerLng', 'zoomLevel', 'defaultBaseMap')
  get unSaved() {
    return Object.keys(this.changedAttributes()).length > 1;
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
