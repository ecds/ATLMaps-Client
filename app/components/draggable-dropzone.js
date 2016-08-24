import Ember from 'ember';

/* global L */

const {
    Component
} = Ember;

export default Component.extend({
    classNames: ['draggable-dropzone'],
    classNameBindings: ['dragClass'],
    dragClass: 'deactivated',
    tagged: '',

    dragLeave(event) {
        event.preventDefault();
        this.set('dragClass', 'deactivated');
    },

    dragOver(event) {
        event.preventDefault();
        this.set('dragClass', 'activated');
    },

    drop(event) {
        let data = event.dataTransfer.getData('text/data');
        this.sendAction('dropped', data);
        this.set('dragClass', 'deactivated');
    },

    didInsertElement: function() {
        let layer = this.get('layer');
        let map = L.map('map');
        map.fitBounds([
            [layer.get('miny'), layer.get('minx')],
            [layer.get('maxy'), layer.get('maxx')]
        ]);
        // map'.setView([], 16);
        // Tile Layers. See the Leaflet docs for all the options
        // http://leafletjs.com/reference.html#tilelayer
        // Also, find the base layer that is right for you:
        // http://leaflet-extras.github.io/leaflet-providers/preview/
        // This creates a base layer of satellite
        let satellite = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
            attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> ' +
                '&mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, ' +
                'Farm Service Agency',
            subdomains: '1234'
        });
        // This creates the OpenStreetMap base layer.
        // Note, at the end, we add it to the map. This means it will show up by
        // default.
        let osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            // maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">' +
                'OpenStreetMap</a> contributors ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map); // Adding to the `map` so it shows on initial load.
        // Here we are adding our own layer made up of static tiles on a file
        // system. The tiles can be anywhere that is web accessable.
        // In this example, the tiles are hosed on S3.
        // Here we are pulling the archival map from GeoServer using its WMS
        // service.
        let wmsLayer = L.tileLayer.wms('https://geospatial.library.emory.edu/geoserver/ATLMaps/wms', {
            layers: layer.get('workspace') + ':' + layer.get('name'), // GeoServer Workspace + layer name
            format: 'image/png', // Image format
            transparent: true // Change this to false and just see how bad it is
        }).addTo(map).setZIndex(10).getContainer();
        // Add an id to the archival map layer so we can manipulate it.
        wmsLayer.id += 'raster';
        // This is a variable to group the OSM and satellite layers so we can
        // toggle between them.
        let baseMaps = {
            'Open Stree Map': osm,
            'Satellite': satellite
        };
        // Add the layer control button so we can toggle the layers.
        // http://leafletjs.com/reference.html#control
        // http://leafletjs.com/examples/layers-control.html
        L.control.layers(baseMaps).addTo(map);
        // minx: "-84.37733782",
        // miny: "33.73252303",
        // maxx: "-84.36551023",
        // maxy: "33.7441728",
    }
});
