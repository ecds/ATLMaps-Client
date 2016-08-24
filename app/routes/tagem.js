import Ember from 'ember';

/**
 * Route for tagging interface.
 *
 * This route provides a way for users to quickly add tags to a random map.
 *
 * @module
 * @augments ember/Route
 *
 */

const {
    Route,
    RSVP,
    get
} = Ember;

export default Route.extend({
    model() {
        return RSVP.hash({
            categories: this.store.findAll('category'),
            layer: this.store.queryRecord('raster-layer', { tagem: true })
        });
    },

    actions: {
        addTag(tagID) {
            let tag = this.store.peekRecord('tag', tagID);
            let layer = this.currentModel.layer;

            let ids = get(layer, 'tag_ids');
            ids.pushObject(tag);
            layer.save();
        }

    }
});
