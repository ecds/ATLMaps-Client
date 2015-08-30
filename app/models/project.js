import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
    description: DS.attr('string'),
    center_lat: DS.attr('number'),
    center_lng: DS.attr('number'),
    zoom_level: DS.attr('number'),
    user_id: DS.attr(),
    saved: DS.attr('boolean'),
    published: DS.attr('boolean'),
    user: DS.attr(),
    layer_ids: DS.hasMany('layer', {async: true}),
    raster_layer_ids: DS.hasMany('raster_layer', {async: true}),
    vector_layer_ids: DS.hasMany('vector_layer', {async: true}),
    slug: DS.attr('string'),
    owner: DS.attr(),
    is_mine: DS.attr('boolean'),
    may_edit: DS.attr('boolean')
});
