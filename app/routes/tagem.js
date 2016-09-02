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
    $,
    Route,
    RSVP,
    get,
    inject: {
        service
    },
    set
} = Ember;

export default Route.extend({
    mapObject: service(),
    session: service(),
    currentUser: service(),

    afterModel() {
        let foo = this.get('currentUser.user');
        console.log('foo', this.get('currentUser.user.displayname'));
        return foo;

        var Legend = L.Control.extend({
          options: {
            position: 'bottomright'
          },

          onAdd: function (map) {
            var legend = L.DomUtil.create('div', 'map-legend', L.DomUtil.get('map'));

            // here we can fill the legend with colors, strings and whatever

            return legend;
          }
        });

        map.addControl(new Legend());
    },

    model() {
        return RSVP.hash({
            categories: this.store.findAll('category'),
            layer: this.store.queryRecord('raster-layer', { tagem: true })
        });
    },

    actions: {
        addTag(tagID) {
            // let tag = this.store.peekRecord('tag', tagID);
            let layer = this.currentModel.layer;
            let userID = get(this, 'session.session.content.authenticated.user.id');

            let userTagged = this.store.createRecord('user-tagged', {
                tag_id: tagID,
                raster_layer_id: layer.id,
                user_id: userID
            });

            userTagged.save();

            let count = this.store.peekRecord('user', userID);
            set(count, 'number_tagged', count.get('number_tagged') + 1);
        },

        getNextMap() {
            let _this = this;
            this.store.unloadAll('raster-layer');
            this.get('mapObject.map').remove();
            // set(this, 'currentModel.layer', '');
            get(this, 'mapObject').createMap();
            this.store.queryRecord('raster-layer', { tagem: true }).then(function(nextLayer) {
                set(_this, 'layer', nextLayer);
                set(_this, 'currentModel.layer', nextLayer);
                get(_this, 'mapObject').mapSingleLayer(nextLayer);
            });
        },

        opacity() {
            let val = $('.opacity').val();
            let layer = this.currentModel.layer;
            console.log('val', val);
            get(this, 'mapObject.projectLayers')[get(layer, 'slug')].setOpacity(val);
        }

    }
});
