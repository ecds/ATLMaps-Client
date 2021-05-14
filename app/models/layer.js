import LayerMetaModel from './layer-meta';
import { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import ENV from 'atlmaps-client/config/environment';
import { inject as service } from '@ember/service';

export default class LayerModel extends LayerMetaModel {
  @service fastboot;

  constructor() {
    super(...arguments);
    this.checkFastBoot();
  }

  // Dynamic import for FastBoot
  async checkFastBoot() {
    if (this.fastboot.isFastBoot) return;
    this.L = await import('leaflet');
  }

  @belongsTo('institution') institution;
  @attr('string') url;
  @attr() maxx;
  @attr() maxy;
  @attr() minx;
  @attr() miny;
  @attr('string') dataFormat;
  @attr('string') workspace;
  @attr('boolean', {
    defaultValue() { return false; }
  }) onMap;


  @computed('name')
  get shareUrl() {
    return `${ENV.APP.HOST}/layers/${this.name}`;
  }

  @computed('name')
  get embedUrl() {
    return `${ENV.APP.HOST}/embed/${this.name}`;
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
}
