import DS from 'ember-data';

export default DS.Model.extend({
	vector_layer_id: DS.attr(),
    project_id: DS.attr(),
    marker: DS.attr(),
    layer_type: DS.attr(),
    position: DS.attr()
});
