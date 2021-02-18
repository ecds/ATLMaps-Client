import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default class RasterLayerProjectModel extends Model {
  @attr('number') position;

  @belongsTo('rasterLayer') rasterLayer;
  @belongsTo('project') project;

  @computed('position')
  get isTop() {
    return this.position >= this.get('project.rasters').length + 10;
  }

  @computed('position')
  get isBottom() {
    return this.position <= 11;
  }
}
