import Model, { attr, hasMany } from '@ember-data/model';

export default class VectorLayerModel extends Model {
  @attr('string') title;
  @hasMany('vectorLayerProject', { async: true }) vectorLayerProjects;
}
