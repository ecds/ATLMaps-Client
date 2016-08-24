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
    layer_ids: hasMany('layer', {
        async: true
    }),
    user_ids: hasMany('user', {
        async: true
    }),
    checked: attr('boolean', {
        defaultValue: false
    })
});
