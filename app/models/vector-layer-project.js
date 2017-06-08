import DS from 'ember-data';
import Ember from 'ember';
import LayerProject from './layer-project';

const { computed, get, inject: { service } } = Ember;

const {
    attr,
    belongsTo
} = DS;

export default LayerProject.extend({
    vector_layer: belongsTo('vector_layer', {
        async: false,
        inverse: null
    }),
    marker: attr(),
    data_type: attr('string'),
    dataColors: service(),
    colorName: computed(function colorName() {
        if (get(this, 'data_type') === 'point-data') {
            return get(this, 'dataColors.markerColors')[this.get('marker')].name || null;
        }
        return get(this, 'dataColors.shapeColors')[this.get('marker')].name || null;
    }).property('marker'),
    colorHex: computed(function colorName() {
        if (get(this, 'data_type') === 'point-data') {
            return get(this, 'dataColors.markerColors')[this.get('marker')].hex || null;
        }
        return get(this, 'dataColors.shapeColors')[this.get('marker')].hex || null;
    }).property('marker'),

    showing: computed(function isShowing() {
        return get(this, 'vector_layer.showing');
    }).property('vector_layer.showing')
});
