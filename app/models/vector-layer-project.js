import DS from 'ember-data';

export default DS.Model.extend({
	vector_layer_id: DS.belongsTo('vector_layer', {async: true, inverse: null}),
    project_id: DS.attr(),
    marker: DS.attr(),
    data_format: DS.attr(),

	// Non-API property. Used to show/hide the layer's description in the list.
	clicked: DS.attr('boolean', { defaultValue: false })
});
