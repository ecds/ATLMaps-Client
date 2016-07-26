import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    center_lat: DS.attr('number'),
    center_lng: DS.attr('number'),
    zoom_level: DS.attr('number'),
    default_base_map: DS.attr('string'),
    user_id: DS.attr(),
    saved: DS.attr('boolean'),
    published: DS.attr('boolean'),
    featured: DS.attr('boolean'),
    user: DS.attr(),
    raster_layer_project_ids: DS.hasMany('raster_layer_project', {
        async: true
    }),
    vector_layer_project_ids: DS.hasMany('vector_layer_project', {
        async: true
    }),
    slug: DS.attr('string'),
    owner: DS.attr(),
    is_mine: DS.attr('boolean'),
    may_edit: DS.attr('boolean'),
    templateSlug: DS.attr('string'),
    intro: DS.attr('string'),
    media: DS.attr('string'),
    template_id: DS.attr('number'),
    card_url: DS.attr('string'),

    // The following are non-API based attributes.

    // Non-API backed attributes for managing state.
    is_editing: DS.attr('boolean', {
        defaultValue: true
    }),
    showing_browse_results: DS.attr('boolean', {
        defaultValue: true
    }),
    showing_all_vectors: DS.attr('boolean', {
        defaultValue: true
    }),
    showing_all_rasters: DS.attr('boolean', {
        defaultValue: true
    }),
    edit_success: DS.attr('boolean', {
        defaultValue: false
    }),
    edit_fail: DS.attr('boolean', {
        defaultValue: false
    }),


    // Attribute that will be set to true if a user is "exploring".
    exploring: DS.attr('boolean', {
        defaultValue: false
    }),
    editing: DS.attr('boolean', {
        defaultValue: false
    }),

    may_browse: DS.attr('boolean', {
        defaultValue: false
    }),

    // Computed property that sorts rasters by on the position their `position`
    // in the project. See http://emberjs.com/api/classes/Ember.computed.html#method_sort
    sortedRasterLayers: Ember.computed.sort('raster_layer_project_ids', '_positionSort'),
    _positionSort: ['position:desc'],

    // The following computed values are used for the show/hide all toggle switch.
    // The goal is to turn the toggle switch back to true when you make a layer visiable again.

    // We'll call length on this so we can set the toggle switch if all vectors
    // are hidden. See http://emberjs.com/api/classes/Ember.computed.html#method_filterBy
    hidden_vectors: Ember.computed.filterBy('vector_layer_project_ids', 'showing', true),

    // Booleans are easier to deal with.
    visiable_vector: Ember.computed('hidden_vectors', function() {
        return this.get('hidden_vectors').length > 0;
    }),

    // Like `hidden_vectors` we'll call length to see if any rasters are visiable.
    hidden_rasters: Ember.computed.filterBy('raster_layer_project_ids', 'showing', true),

    // Booleans are easier to deal with.
    visiable_raster: Ember.computed('hidden_rasters', function() {
        return this.get('hidden_rasters').length > 0;
    })
});
