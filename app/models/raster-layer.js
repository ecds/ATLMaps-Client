import Model, { attr, hasMany } from '@ember-data/model';

export default class RasterLayerModel extends Model {
  @attr('string') name;
  @attr('string') title;
  @attr('string') url;
  @attr('string') layers;
  @attr('string') description;
  @attr() thumb;
  @hasMany('rasterLayerProject') rasterLayerProjects;
  // @belongsTo('project', { async: false }) project;
}
