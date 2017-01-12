import DS from 'ember-data';
import Layer from './layer';

const { attr, belongsTo } = DS;

export default Layer.extend({
    marker: attr(),
    vector_layer_project: belongsTo('vector_layer_project', {
        async: true,
        inverse: null
    }),
    colorName: attr('string'),
    colorHex: attr('string')

});
