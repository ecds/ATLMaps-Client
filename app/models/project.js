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
	raster_layer_project_ids: DS.hasMany('raster_layer_project', {async: true}),
    vector_layer_project_ids: DS.hasMany('vector_layer_project', {async: true}),
    slug: DS.attr('string'),
    owner: DS.attr(),
    is_mine: DS.attr('boolean'),
    may_edit: DS.attr('boolean'),
	templateSlug: DS.attr('string'),
	intro: DS.attr('string'),
	media: DS.attr('string'),
	template_id: DS.attr('number'),

	// Attribute that will be set to true if a user is "exploring".
	exploring: DS.attr('boolean', { defaultValue: false }),

	// TODO remember how this actually works and document it.
	// Computed property that sorts rasters by on the position their `position` in the project.
	sortedRasterLayers: Ember.computed.sort('raster_layer_project_ids', '_positionSort'),
    _positionSort: ['position:desc']
});
