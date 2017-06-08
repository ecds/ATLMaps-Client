import DS from 'ember-data';

const {
    Model,
    attr,
    hasMany
} = DS;

export default Model.extend({
    name: attr('string'),
    slug: attr('string'),
    geoserver: attr('string'),
    icon: attr('string'),
    raster_layers: hasMany('raster_layer', {
        async: true
    }),
    vector_layers: hasMany('vector_layer', {
        async: true
    }),
    users: hasMany('user', {
        async: true
    }),
    checked: attr('boolean', {
        defaultValue: false
    })
});
