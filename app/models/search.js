import DS from 'ember-data';

const {
    Model,
    attr,
    hasMany
} = DS;

export default Model.extend({
    raster_layer_ids: hasMany('raster_layer', {
        async: true
    }),
    vector_layer_ids: hasMany('vector_layer', {
        async: true
    }),
    search_terms: attr('text')
});
