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
        // let foo = this.get('currentUser.user');
        // return foo;

        // var Legend = L.Control.extend({
        //     options: {
        //         position: 'bottomright'
        //     },
        //
        //     onAdd: function(map) {
        //         var legend = L.DomUtil.create('div', 'map-legend', L.DomUtil.get('map'));
        //
        //         // here we can fill the legend with colors, strings and whatever
        //
        //         return legend;
        //     }
        // });
        //
        // map.addControl(new Legend());
    },

    model() {
        return RSVP.hash({
            categories: this.store.findAll('category'),
            layer: this.store.queryRecord('raster-layer', {
                tagem: true
            }),
            userTagged: this.store.peekAll('user-tagged')
        });
    },

    actions: {
        addTag(tagID) {
            let tag = this.store.peekRecord('tag', tagID);
            tag.toggleProperty('assigned');
            let { currentModel: { layer } } = this;
            let userID = get(this, 'currentUser.user.id');

            let count = this.store.peekRecord('user', userID);

            if (tag.get('assigned') === true) {
                let tagged = this.store.createRecord('user-tagged', {
                    tag_id: tagID,
                    raster_layer_id: layer.id,
                    user_id: userID
                });
                this.get('currentUser.tags')[tag.get('name')] = tagged;
                set(count, 'number_tagged', count.get('number_tagged') + 1);
            } else {
                console.log(this.get('currentUser.tags')[tag.get('name')]);
                this.store.deleteRecord(this.get('currentUser.tags')[tag.get('name')]);
                set(count, 'number_tagged', count.get('number_tagged') - 1);
            }
        },

        getNextMap() {
            let _this = this;
            let userTagged = this.store.peekAll('user-tagged');
            set(this, 'currentUser.tags', {});

            // Reset all tags.
            this.store.peekAll('tag').setEach('assigned', false);

            userTagged.save().then(function() {
                _this.store.unloadAll('user-tagged');
            }, function(errors) {
                console.log('error', errors.errors.msg);
            });

            this.store.unloadAll('raster-layer');

            this.get('mapObject.map').remove();
            // set(this, 'currentModel.layer', '');
            get(this, 'mapObject').createMap();
            this.store.queryRecord('raster-layer', {
                tagem: true
            }).then(function(nextLayer) {
                set(_this, 'layer', nextLayer);
                set(_this, 'currentModel.layer', nextLayer);
                get(_this, 'mapObject').mapSingleLayer(nextLayer);
            });
        },

        opacity() {
            let val = $('.opacity').val();
            let { currentModel: { layer } } = this;
            get(this, 'mapObject.projectLayers')[get(layer, 'slug')].setOpacity(val);
        }

    }
});
