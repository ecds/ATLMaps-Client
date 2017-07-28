/* eslint new-cap: ["error", { "newIsCapExceptions": ['htmlSafe'] }] */
import DS from 'ember-data';
import Ember from 'ember';
import Layer from './layer';

const {
    attr,
    belongsTo
} = DS;

const {
    computed,
    get,
    String: {
        htmlSafe
    }
} = Ember;

export default Layer.extend({
    workspace: attr('string'),
    slider_value_id: attr('string'),
    position_in_project: attr(''),
    raster_layer_project: belongsTo('raster_layer_project', {
        async: true,
        inverse: null
    }),
    layers: attr('string'),
    sliderObject: attr(),
    tagem: attr('boolean'),
    position: attr('number'),
    thumb: attr(),
    safe_background_thumb: computed(function safeBackgroundPhoto() {
        return new htmlSafe(`background-image: url("${get(this, 'thumb.url')}");`);
    }).property('photo')
});
