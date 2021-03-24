import Model, { attr, hasMany } from '@ember-data/model';

export default class InstitutionModel extends Model {
  @attr('string') name;
  @attr('string') icon;
  @attr('string') geoserver;
  @attr('boolean', {
    defaultValue() { return false; }
  }) selected;
  @hasMany('rasterLayer') rasterLayers;
  @hasMany('vectorLayer') vectorLayers;
}
