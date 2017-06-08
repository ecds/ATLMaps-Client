import DS from 'ember-data';

const {
    Model,
    attr,
    hasMany
} = DS;

export default Model.extend({
    name: attr('string'),
    slug: attr('string'),
    rasterLayer: hasMany('raster_layer', {
        async: true
    }),
    vectorLayer: hasMany('vector_layer', {
        async: true
    }),
    category: hasMany('category', {
        async: true
    }),
    checked: attr('boolean', {
        defaultValue: false
    }),
    assigned: attr('boolean', {
        defaultValue: false
    })
});
