import DS from 'ember-data';
import Layer from './layer';

const {
    attr,
    belongsTo
} = DS;

export default Layer.extend({
    workspace: attr('string'),
    slider_value_id: attr('string'),
    position_in_project: attr(''),
    raster_layer_project: belongsTo('raster_layer_project', {
        async: true,
        inverse: null
    }),
    layers: attr('string'),
    sliderObject: attr(),
    tagem: attr('boolean'),
    position: attr('number')
});
