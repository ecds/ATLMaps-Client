import Model, { attr, hasMany } from '@ember-data/model';

export default class InstitutionModel extends Model {
  @attr('string') name;
  @attr('string') icon;
  @attr('string') geoserver;
  @hasMany('rasterLayer') rasterLayers;
  @hasMany('vectorLayer') vectorLayers;
}
