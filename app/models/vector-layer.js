import DS from 'ember-data';
import Layer from './layer';

const { belongsTo } = DS;

export default Layer.extend({
    vector_layer_project: belongsTo('vector_layer_project', {
        async: true,
        inverse: null
    })
});
