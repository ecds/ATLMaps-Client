import Ember from 'ember';

/* global L */

export default Ember.Component.extend({
	didInsertElement: function() {

        console.log(this.globals.mapObject);
        
        var _map = L.map('map', {
            center: [33.7489954,-84.3879824],
            zoom: 13,
            zoomControl:false 
        });
        
        var osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors Georgia State University and Emory University',
            detectRetina: true
        }).addTo(_map);
        
        var MapQuestOpen_Aerial = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
            attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency contributors Georgia State University and Emory University',
            subdomains: '1234',
            detectRetina: true
        });
                
        var baseMaps = {
            "Street": osm,
            "Satellite": MapQuestOpen_Aerial
        };        
        
        L.control.zoom({ position: 'topright' }).addTo(_map);
        L.control.layers(baseMaps).addTo(_map);

        //map = _map;
        //console.log(map)
        //Ember.store.set('map', map);
        // save map instance
        console.log('map set up');
        this.globals.set('mapObject', _map);
        console.log(this.globals.mapObject);
        //map = _map;
    },
});
