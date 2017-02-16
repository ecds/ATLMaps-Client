import DS from 'ember-data';
import Ember from 'ember';

const {
    Model,
    attr,
    hasMany
} = DS;
const {
    computed,
    get
} = Ember;

export default Model.extend({
    name: attr('string'),
    description: attr('string'),
    center_lat: attr('number'),
    center_lng: attr('number'),
    zoom_level: attr('number'),
    default_base_map: attr('string'),
    user_id: attr(),
    saved: attr('boolean'),
    published: attr('boolean'),
    featured: attr('boolean'),
    user: attr(),
    raster_layer_project_ids: hasMany('raster_layer_project', {
        async: true
    }),
    vector_layer_project_ids: hasMany('vector_layer_project', {
        async: true
    }),
    raster_layer_ids: hasMany('raster_layer', {
        async: true
    }),
    vector_layer_ids: hasMany('vector_layer', {
        async: true
    }),
    slug: attr('string'),
    owner: attr(),
    mine: attr('boolean'),
    may_edit: attr('boolean'),
    templateSlug: attr('string'),
    intro: attr('string'),
    media: attr('string'),
    photo: attr('string'),
    template_id: attr('number'),
    card_url: attr('string'),

    // The following are non-API based attributes.

    // Non-API backed attributes for managing state.
    is_editing: attr('boolean', {
        defaultValue: true
    }),
    showing_browse_results: attr('boolean', {
        defaultValue: false
    }),
    showing_all_vectors: attr('boolean', {
        defaultValue: true
    }),
    showing_all_rasters: attr('boolean', {
        defaultValue: true
    }),
    suppressIntro: attr('boolean', {
        defaultValue: false
    }),
    hasSuppressCookie: attr('boolean', {
        defaultValue: false
    }),
    edit_success: attr('boolean', {
        defaultValue: false
    }),
    edit_fail: attr('boolean', {
        defaultValue: false
    }),

    // Attribute that will be set to true if a user is "exploring".
    exploring: attr('boolean', {
        defaultValue: false
    }),

    may_browse: attr('boolean', {
        defaultValue: false
    }),

    // Computed property that sorts rasters by on the position their `position`
    // in the project. See http://emberjs.com/api/classes/Ember.computed.html#method_sort
    sortedRasterLayers: computed.sort('raster_layer_project_ids', '_positionSort'),
    _positionSort: ['position:desc'],

    // If someone is allowed to edit a project, we start with `editing` set to `true`.
    editing: computed(function startEditing() {
        if (this.may_edit === true) {
            return true;
        }
        return false;
    }).property('this.may_edit'),

    // Used in determing which nave links to show.
    hasRasters: computed(function hasRasters() {
        return get(this, 'raster_layer_project_ids.length') > 0;
    }).property('raster_layer_project_ids'),

    hasVectors: computed(function hasVectors() {
        return get(this, 'vector_layer_project_ids.length') > 0;
    }).property('vector_layer_project_ids'),

    // The following computed values are used for the show/hide all toggle switch.
    // The goal is to turn the toggle switch back to true when you make a layer visiable again.

    // We'll call length on this so we can set the toggle switch if all vectors
    // are hidden. See http://emberjs.com/api/classes/Ember.computed.html#method_filterBy
    visiable_vectors: computed.filterBy('vector_layer_project_ids', 'showing', true),

    // Booleans are easier to deal with.
    visiable_vector: computed(function visiableVector() {
        return get(this, 'visiable_vectors').length > 0;
    }).property('visiable_vectors'),

    // Like `hidden_vectors` we'll call length to see if any rasters are visiable.
    // visiable_rasters: computed.filterBy('raster_layer_project_ids', 'showing', true),

    // Like `hidden_vectors` we'll call length to see if any rasters are visiable.
    visiable_rasters: computed.filterBy('raster_layer_project_ids', 'showing', true),

    // Booleans are easier to deal with.
    visiable_raster: computed(function visiableRaster() {
        return get(this, 'visiable_rasters').length > 0;
    }).property('visiable_rasters'),

    hasIntro: computed(function hasIntro() {
        if (get(this, 'intro') || get(this, 'media')) {
            return true;
        }
        return false;
    })

    // TODO Still needed?
    // twoColIntro: computed(function() {
    //     if (get(this, 'intro') && get(this, 'media')) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // })
});
