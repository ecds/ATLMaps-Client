import DS from 'ember-data';

const {
    attr,
    belongsTo
} = DS;

import Layer from './layer';

export default Layer.extend({

    marker: attr(),
    vector_layer_project: belongsTo('vector_layer_project', {
        async: true,
        inverse: null
    }),
    color_name: attr('string'),
    color_hex: attr('string'),
    showing: attr('boolean', {
        defaultValue: true
    })

});
