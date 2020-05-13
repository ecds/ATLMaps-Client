import Model, { belongsTo } from '@ember-data/model';

export default class VectorLayerProjectModel extends Model {
  @belongsTo('vectorLayer') vectorLayer;
  @belongsTo('project') project;
}
