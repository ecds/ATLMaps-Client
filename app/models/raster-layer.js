import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import L from 'leaflet';

export default class RasterLayerModel extends Model {
  @service fastboot;

  @attr('string') name;
  @attr('string') title;
  @attr('string') url;
  @attr('string') layers;
  @attr('string') description;
  @attr('string') thumb_url;
  @hasMany('rasterLayerProject') rasterLayerProjects;
  @belongsTo('institution') institution;
  @attr('boolean', {
    defaultValue() { return false; }
  }) onMap;
  @attr() maxx;
  @attr() maxy;
  @attr() minx;
  @attr() miny;
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

  @computed('minx', 'maxx', 'miny', 'maxy')
  get latLngBounds() {
    if (this.fastboot.isFastBoot) return null;
    if ([this.minx, this.miny, this.maxx, this.maxy].any(i => !i)) return null;
    return L.latLngBounds(
      L.latLng(this.maxy, this.maxx),
      L.latLng(this.miny, this.minx)
    );
  }
}
