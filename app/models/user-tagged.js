import DS from 'ember-data';

const {
    Model,
    attr
} = DS;

export default Model.extend({
    user_id: attr('number'),
    raster_layer_id: attr('number'),
    vector_layer_id: attr('number'),
    tag_id: attr('number')
});
