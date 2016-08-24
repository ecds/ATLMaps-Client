import DS from 'ember-data';

const {
    attr,
    belongsTo
} = DS;

import LayerProject from './layer-project';

export default LayerProject.extend({
    vector_layer_id: belongsTo('vector_layer', {
        async: true,
        inverse: null
    }),
    marker: attr()
});
