import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import ENV from 'atlmaps-client/config/environment';
import { inject as service } from '@ember/service';

export default class ProjectModel extends Model {
  @service baseMaps;
  @service store;
  @service lazyEmbed;

  @attr('string', {
    defaultValue() { return 'untitled'; }
  }) name;
  @attr('string') description;
  @attr('string') intro;
  @attr('string') media;
  @attr('string') photo;
  @attr('string') owner;

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
  }) featured;

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

  @computed('vectors.@each')
  get places() {
    const places = this.get('vectors').filter(layer => {
      return layer.dataType == 'qualitative';
    });
    return [...new Set(places)];
  }

  @computed('vectors.@each')
  get data() {
    const data = this.vectors.filter(layer => {
      return layer.dataType == 'quantitative';
    });
    return [...new Set(data)];
  }

  @computed('rasters')
  get hasRasters() {
    return this.rasters.length > 0;
  }

  @computed('vectors.@each')
  get hasVectors() {
    return this.vectors.length > 0;
  }

  @computed('vectors.@each', 'places')
  get hasPlaces() {
    return this.places.length > 0;
  }

  @computed('vectors.@each', 'data')
  get hasData() {
    return this.data.length > 0;
  }

  @computed('rasters.@each.opacity')
  get allRastersHidden() {
    return this.get('rasters').isEvery('opacity', "0") || this.get('rasters').isEvery('opacity', 0);
  }

  @computed('vectors.@each.show')
  get allVectorsHidden() {
    return this.get('vectors').isEvery('show', false);
  }

  @computed('rasters.@each.opacity', 'vectors.@each.show')
  get allLayersHidden() {
    return this.allRastersHidden && this.allVectorsHidden;
  }

  @computed('name', 'description', 'published', 'centerLat', 'centerLng', 'zoomLevel', 'defaultBaseMap')
  get unSaved() {
    return Object.keys(this.changedAttributes()).length > 1;
  }

  @computed
  get activeFeature() {
    return this.store.peekAll('vectorFeature').filter(feature => feature.active).firstObject;
  }

  @computed('vectors.@each.order')
  get vectorOnTop() {
    const vectorPositions = this.vectors.map(v => {
      return v.order;
    });
    const max = Math.max(...vectorPositions);
    return this.vectors.filter(v => v.order == max).firstObject;
  }
  set vectorOnTop(topVector) {
    return topVector;
  }

  @computed
  get isNew() {
    if (
      !this.name
      && !this.description
      && this.mayEdit
    ) return true;
    return false;
  }

  @computed('intro', 'media')
  get hasIntro() {
    return this.intro != null || this.media != null;
  }

  @computed('media')
  get embedUrl() {
    return this.lazyEmbed.getEmbedUrl(this.media);
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
