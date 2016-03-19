import DS from 'ember-data';

export default DS.Model.extend({
	project_id: DS.attr(),
	data_format: DS.attr(),
	position: DS.attr(),
	// project: DS.belongsTo('project', {async: true}),
	// raster_layer: DS.belongsTo('raster_layer', {async: true, inverse: null}),
	raster_layer_id: DS.belongsTo('raster_layer', {async: true, inverse: null}),
	clicked: DS.attr('boolean', { defaultValue: false })
});
