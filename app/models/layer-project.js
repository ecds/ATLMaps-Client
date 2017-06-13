import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
    /*
    * Extended by RasterLayerProject and VectorLayerProject.
    */
    data_format: attr(),

    // Non-API property. Used to show/hide the layer's description in the list.
    clicked: attr('boolean', {
        defaultValue: false
    }),
    project: belongsTo('project')
});
