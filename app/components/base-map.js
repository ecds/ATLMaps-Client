import Ember from 'ember';

/* global L */

export default Ember.Component.extend({
    classNames: ['fullscreen-map'],

    didInsertElement: function() {

        var _map = L.map('map', {
            center: [33.7489954,-84.3879824],
            zoom: 13,
            zoomControl:false
        });

        L.control.zoom({ position: 'topright' }).addTo(_map);

        // Sets the global variable in /app/initializers/globals.js
        this.globals.set('mapObject', _map);

    },
});
