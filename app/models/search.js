import DS from 'ember-data';

export default DS.Model.extend({
  raster_layer_ids: DS.hasMany('raster_layer', {async: true}),
  vector_layer_ids: DS.hasMany('vector_layer', {async: true})
});
