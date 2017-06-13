import DS from 'ember-data';
import Layer from './layer';

const { attr, belongsTo, hasMany } = DS;

export default Layer.extend({
    vector_layer_project: belongsTo('vector_layer_project', {
        async: true,
        inverse: null
    }),
    // vector_feature: attr(),
    vector_feature: hasMany('vector-feature', { async: false }),
    features: attr(),
    filters: attr()
});
