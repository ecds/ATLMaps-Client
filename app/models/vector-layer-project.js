import DS from 'ember-data';
import Ember from 'ember';
import LayerProject from './layer-project';

const { computed, get, inject: { service } } = Ember;

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
    data_type: attr('string'),
    dataColors: service(),
    colorName: computed(function colorName() {
        if (get(this, 'data_type') === 'point-data') {
            return get(this, 'dataColors.markerColors')[this.get('marker')].name;
        }
        return get(this, 'dataColors.shapeColors')[this.get('marker')].name;
    }).property('marker'),
    colorHex: computed(function colorName() {
        if (get(this, 'data_type') === 'point-data') {
            return get(this, 'dataColors.markerColors')[this.get('marker')].hex;
        }
        return get(this, 'dataColors.shapeColors')[this.get('marker')].hex;
    }).property('marker'),

    showing: computed(function isShowing() {
        return get(this, 'vector_layer_id.showing');
    }).property('vector_layer_id.showing')
});
