import Ember from 'ember';

/* global L */

export default Ember.Component.extend({
    mapObject: Ember.inject.service('mapObject'),

    classNames: ['fullscreen-map'],

    didInsertElement: function() {

        try {
            var _map = L.map('map', {
                center: [33.7489954,-84.3879824],
                zoom: 13,
                zoomControl:false
            });

            L.control.zoom({ position: 'topright' }).addTo(_map);

            // Create the object for Leafet in the mapObject service.
            this.get('mapObject').createMap(_map);

        }
        catch(err){/* don't care */}

    },
});
