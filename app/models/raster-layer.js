import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RasterLayerModel extends Model {
  @attr('string') name;
  @attr('string') title;
  @attr('string') url;
  @attr('string') layers;
  @attr('string') description;
  @attr() thumb;
  @hasMany('rasterLayerProject') rasterLayerProjects;
  @belongsTo('institution') institution;
  @attr('boolean', {
    defaultValue() { return false; }
  }) onMap;

  @attr() leafletObject;
}
