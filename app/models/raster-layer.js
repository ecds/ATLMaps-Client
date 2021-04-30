import LayerModel from './layer';
import { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default class RasterLayerModel extends LayerModel {
  @attr('string') layers;
  @attr('string') thumb_url;
  @hasMany('rasterLayerProject') rasterLayerProjects;
  @attr() leafletObject;
  @attr('number', {
    defaultValue() {
      return 100;
    }
  }) opacity;

  @computed('opacity')
  get opacityTenths() {
    return this.opacity / 100;
  }
}
