/* eslint new-cap: ["error", { "newIsCapExceptions": ['htmlSafe'] }] */
import DS from 'ember-data';
import Ember from 'ember';

const {
    Model,
    attr,
    belongsTo
} = DS;

const {
    get,
    computed,
    String: {
        htmlSafe
    }
} = Ember;

export default Model.extend({
    vector_layer: belongsTo('vector_layer', { async: false }),
    geometry_type: attr('string'),
    geojson: attr(),
    properties: attr(),
    layer_title: attr('string'),
    name: attr('string'),
    description: attr('string'),
    image: attr('string'),
    image_credit: attr('string'),
    images: attr(),
    youtube: attr('string'),
    vimeo: attr('string'),
    audio: attr('string'),
    feature_id: attr('string'),

    // Ember SafeString to render HTML
    safe_description: computed(function safeDescription() {
        return new htmlSafe(get(this, 'description'));
    }).property('photo'),

    // Temporary properties for editing
    lat: attr(),
    lon: attr()
});
