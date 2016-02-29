import DS from 'ember-data';

export default DS.Model.extend({
	vector_layer_id: DS.belongsTo('vector_layer', {async: true, inverse: null}),
    project_id: DS.attr(),
    marker: DS.attr(),
    layer_type: DS.attr(),
    // position: DS.attr(),
	clicked: DS.attr('boolean', { defaultValue: false })
});
