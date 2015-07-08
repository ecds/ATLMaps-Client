import Ember from 'ember';

/* global L */

export default Ember.Component.extend({
	didInsertElement: function() {
        
        // Most of the map set up is in the `initProjectUI` action
        // in the `project` controller.

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
