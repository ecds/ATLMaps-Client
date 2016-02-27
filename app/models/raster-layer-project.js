import DS from 'ember-data';

export default DS.Model.extend({
	raster_layer_id: DS.attr(),
	project_id: DS.attr(),
	layer_type: DS.attr(),
	position: DS.attr(),
	project: DS.belongsTo('project', {async: true}),
	raster_layer: DS.attr()
	// raster_layer: DS.belongsTo('raster_layer', {async: true})
});
