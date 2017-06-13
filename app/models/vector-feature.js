import DS from 'ember-data';

const {
    Model,
    attr,
    belongsTo
} = DS;

export default Model.extend({
    vector_layer: belongsTo('vector_layer', { async: false }),
    geometry_type: attr('string'),
    geojson: attr(),
    properties: attr(),
    layer_title: attr('string'),
    name: attr('string'),
    description: attr('string'),
    image: attr('string'),
    image_credit: attr('string'),
    images: attr(),
    youtube: attr('string'),
    vimeo: attr('string'),
    audio: attr('string'),
    feature_id: attr('string')
});
