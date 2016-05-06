import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({

	name: DS.attr('string'),
	title: DS.attr('string'),
    slug: DS.attr('string'),
    keywords: DS.attr('string'),
    description: DS.attr('string'),
    url: DS.attr('string'),
    layer: DS.attr('string'),
    date: DS.attr('date'),
    data_type: DS.attr('string'),
	data_format: DS.attr('string'),
    zoomlevels: DS.attr('string'),
    minx: DS.attr('number'),
    miny: DS.attr('number'),
    maxx: DS.attr('number'),
    maxy: DS.attr('number'),
    project_ids: DS.hasMany('project', {async: true}),
    tag_ids: DS.hasMany('tag', {async: true}),
    institution: DS.attr(),
    institution_id: DS.belongsTo('institution'),
    tag_slugs: DS.attr('string'),
    active: DS.attr('boolean'),
    marker: DS.attr(),
    active_in_project: DS.attr('boolean', { defaultValue: false }),
	vector_layer_project: DS.belongsTo('vector_layer_project', {async: true, inverse: null}),

	// color_group: Ember.computed(function(){
	// 	if(this.get('data_type') === 'point-data'){
	// 		return 'markerColors';
	// 	}
	// 	else {
	// 		return 'shapeColors';
	// 	}
	// })
});
