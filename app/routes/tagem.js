import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

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

export default Route.extend(AuthenticatedRouteMixin, {
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

    model(params) {
        console.log('params', params);
        let tagem;
        if (params.tagem === 'tagem') {
            tagem = true;
        } else {
            tagem = params.tagem;
        }
        return RSVP.hash({
            categories: this.store.findAll('category'),
            layer: this.store.queryRecord('raster-layer', { tagem }),
            userTagged: this.store.peekAll('user-tagged')
        });
    },

    saveTags() {
        let _this = this;
        set(this, 'currentUser.tags', {});
        let userTagged = this.store.peekAll('user-tagged');

        userTagged.save().then(function() {
            _this.store.unloadAll('user-tagged');
        }, function(errors) {
            console.log('error', errors.errors.msg);
        });
    },

    loadMap(layer) {
        // Reset all tags.
        this.store.peekAll('tag').setEach('assigned', false);

        // this.store.unloadAll('raster-layer');

        this.get('mapObject.map').remove();
        // set(this, 'currentModel.layer', '');
        get(this, 'mapObject').createMap();

        set(this, 'layer', layer);
        set(this, 'currentModel.layer', layer);
        get(this, 'mapObject').mapSingleLayer(layer);
        $('.opacity').val(1);
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

        getNextMap(layer) {
            let _this = this;

            this.store.queryRecord('raster-layer', {
                tagem: true
            }).then(function(nextLayer) {
                _this.saveTags();
                _this.loadMap(nextLayer);
            });

            set(this, 'currentUser.previous', layer);
        },

        getPreviousMap() {
            let _this = this;
            let previous_id = get(this, 'currentUser.previous');
            let userID = get(this, 'currentUser.user.id');
            this.store.findRecord('raster-layer', previous_id).then(function(previousLayer) {
                _this.loadMap(previousLayer);
                _this.store.query('user-tagged', {
                    user_id: userID,
                    raster_layer_id: previousLayer.id
                }).then(function(tags) {
                    tags.forEach(function(tag) {
                        let assigned = _this.store.peekRecord('tag', get(tag, 'tag_id'));
                        assigned.setProperties({ assigned: true });
                    });
                    // console.log('tags', tags);
                });
            });
        },

        opacity() {
            let val = $('.opacity').val();
            let { currentModel: { layer } } = this;
            get(this, 'mapObject.projectLayers')[get(layer, 'slug')].setOpacity(val);
        }

    }
});
