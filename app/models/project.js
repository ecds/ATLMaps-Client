import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	name: DS.attr('string'),
    description: DS.attr('string'),
    center_lat: DS.attr('number'),
    center_lng: DS.attr('number'),
    zoom_level: DS.attr('number'),
    default_base_map: DS.attr('string'),
    user_id: DS.attr(),
    saved: DS.attr('boolean'),
    published: DS.attr('boolean'),
    featured: DS.attr('boolean'),
    user: DS.attr(),
    layer_ids: DS.hasMany('layer', {async: true}),
    raster_layer_ids: DS.hasMany('raster_layer', {async: true}),
    vector_layer_ids: DS.hasMany('vector_layer', {async: true}),
    slug: DS.attr('string'),
    owner: DS.attr(),
    is_mine: DS.attr('boolean'),
    may_edit: DS.attr('boolean'),
	templateSlug: DS.attr('string'),
	intro: DS.attr('string'),
	media: DS.attr('string'),
	template_id: DS.attr('number'),

	sortedRasterLayers: Ember.computed.sort('raster_layer_ids', '_positionSort'),
    _positionSort: ['position:asc']
});
