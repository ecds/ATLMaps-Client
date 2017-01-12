import DS from 'ember-data';
import Ember from 'ember';
import LayerProject from './layer-project';

const { computed, get } = Ember;

const {
    attr,
    belongsTo
} = DS;

export default LayerProject.extend({
    vector_layer_id: belongsTo('vector_layer', {
        async: true,
        inverse: null
    }),
    marker: attr(),

    showing: computed(function isShowing() {
        return get(this, 'vector_layer_id.showing');
    }).property('vector_layer_id.showing')
});
