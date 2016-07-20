import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Layer from './layer';

export default Layer.extend({
    workspace: attr('string'),
    slider_id: attr('string'),
    slider_value_id: attr('string'),
    position_in_project: attr(''),
    raster_layer_project: belongsTo('raster_layer_project', {
        async: true,
        inverse: null
    }),
    layers: attr('string'),
    opacity: attr('number', {
        defaultValue: 10
    })
});
