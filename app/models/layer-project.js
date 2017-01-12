import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
    /*
    * Extended by RasterLayerProject and VectorLayerProject.
    */
    project_id: attr(),
    data_format: attr(),

    // Non-API property. Used to show/hide the layer's description in the list.
    clicked: attr('boolean', {
        defaultValue: false
    })
});
