import DS from 'ember-data';

const {
    attr,
    belongsTo
} = DS;

import LayerProject from './layer-project';

export default LayerProject.extend({
    data_format: attr(),
    position: attr(),
    raster_layer_id: belongsTo('raster_layer', {
        async: true,
        inverse: null
    }),

    // Non-API attributes for persisting state.
    opacity: attr('number', {
        defaultValue: 10
    })
});
