import Ember from 'ember';

/* globals L */

// Service to hold the Leaflet object.

export default Ember.Service.extend({

    dataColors: Ember.inject.service('data-colors'),
    vectorDetailContent: Ember.inject.service('vector-detail-content'),

    init() {
        this._super(...arguments);
        this.set('map', '');
        this.set('rasterLayers', {});
        this.set('vectorLayers', {});
    },

    createMap( project ) {
        try {
            // Add some base layers
            let street = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors Georgia State University and Emory University'
                    // detectRetina: true,
                    // className: 'street base'
            });

            let satellite = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {
  attribution: 'Map &copy; 2016 <a href="http://developer.here.com">HERE</a>',
  subdomains: '1234',
  base: 'aerial',
  type: 'maptile',
  scheme: 'satellite.day',
  app_id: '1Igi60ZMWDeRNyjXqTZo',
  app_code: 'eA64oCoCX3KZV8bwLp92uQ',
  mapID: 'newest',
  maxZoom: 20,
  language: 'eng',
  format: 'png8',
  size: '256'
            });

            let _map = L.map('map', {
                center: [33.7489954, -84.3879824],
                zoom: 13,
                // zoomControl is a Boolean
                // We add the zoom buttons just below to the top right.
                zoomControl: false,
                layers: [satellite, street]
            });

            Ember.$(satellite.getContainer()).addClass('satellite').addClass('base');
            Ember.$(street.getContainer()).addClass('street').addClass('base');

            // Layer contorl, topright
            L.control.zoom({
                position: 'topright'
            }).addTo(_map);

            _map.on('click', function(){
                // Ember.$("div.info").remove();
                // Ember.$("div.marker-data").hide();
                // Ember.$(".active_marker").removeClass("active_marker");
                project.setProperties({showing_browse_results: false});
                // this.send('activateVectorCard');
            });

            // let baseMaps = {
            //     "satellite": satellite,
            //     "street": osm
            // }
            //
            // L.control.layers(baseMaps,null).addTo(_map);
            // Create the object for Leafet in the mapObject service.
            this.set('map', _map);
            return _map;
        } catch (err) {
            // Map is likely already initialized
        }
    },

    mapLayer(layer) {
        let _this = this;
        let map = this.get('map');
        let zIndex = layer.get('position') + 10;

        layer.get(layer.get('data_format') + '_layer_id').then(function(newLayer) {

            let newLayerName = newLayer.get('name');
            let newLayerTitle = newLayer.get('title');
            let newLayerSlug = newLayer.get('slug');
            let dataType = newLayer.get('data_type');
            // let newLayerInst = newLayer.get('institution.geoserver');
            // let newLayerWorkspace = newLayer.get('workspace');
            let newLayerUrl = newLayer.get('url');
            newLayer.set('active_in_project', true);

            switch (dataType) {

                case 'planningatlanta':

                    var tile = L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/' + newLayerName + '/{z}/{x}/{y}.png', {
                        layer: newLayerSlug,
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    Ember.$(tile).addClass(newLayerSlug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                    break;

                case 'atlTopo':

                    var topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/tilesTopo/{z}/{x}/{y}.jpg', {
                        layer: newLayerSlug,
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    Ember.$(topoTile).addClass(newLayerSlug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                    break;

                case 'wms':
                    let wmsLayer = L.tileLayer.wms(newLayerUrl, {
                        layers: newLayer.get('layers'),
                        format: 'image/png',
                        transparent: true,
                        detectRetina: true,
                        // className: newLayerSlug,
                        zIndex: zIndex,
                        opacity: 1
                    });

                    // let layerObj = {name: newLayerSlug, mapObj: wmsLayer};
                    // layerObj[newLayerSlug] = wmsLayer;
                    _this.get('rasterLayers')[newLayerSlug] = wmsLayer;

                    wmsLayer.addTo(map);

                    Ember.$(wmsLayer.getContainer()).addClass(newLayerSlug).addClass('atLayer').css("zIndex", zIndex);

                    break;

                    // NOTE: At some point we'll move the vector data to GeoServer
                    // case 'wfs':
                    //  //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON&callback=jQuery21106192189888097346_1421268179487&_=1421268179488
                    //  //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text/javascript
                    //  var wfsLayer = institution.geoserver + layer.get('url') + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.get('url') + ":" + layer.get('slug') + "&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON";

                    //  Ember.$.ajax(wfsLayer,
                    //      { dataType: 'jsonp' }
                    //      ).done(function ( data ) {});

                    //  // This part is the magic that makes the JSONP work
                    //  // The string at the beginning of the JSONP is processJSON
                    //  function processJSON(data) {
                    //      points = wfsLayer(data,{
                    //          //onEachFeature: onEachFeature,
                    //          pointToLayer: function (feature, latlng) {
                    //              return L.marker(latlng);
                    //          }
                    //      }).addTo(map);
                    //  }

                    //  break;

                case 'point-data':
                case 'polygon':
                case 'line-data':

                    switch (dataType) {
                        case 'point-data':
                            let markerColors = _this.get('dataColors.markerColors');
                            newLayer.setProperties({
                                color_name: markerColors[layer.get('marker')].name,
                                color_hex: markerColors[layer.get('marker')].hex

                            });
                            let layerClass = newLayerSlug + ' atLayer vectorData map-marker layer-' + newLayer.get('color_name');
                            let markerDiv = '<div class="map-marker vector-icon vector pull-left ' + dataType + ' layer-' + newLayer.get('color_name') + '"></div>';
                            if (newLayerUrl) {
                                var points = new L.GeoJSON.AJAX(newLayerUrl, {
                                    pointToLayer: function(feature, latlng) {
                                        var icon = L.divIcon({
                                            className: layerClass,
                                            iconSize: null,
                                            html: '<div class="shadow"></div><div class="icon"></div>',
                                        });

                                        var marker = L.marker(latlng, {
                                            icon: icon,
                                            title: newLayerTitle,
                                            markerDiv: markerDiv
                                        });

                                        return marker;
                                    },

                                    onEachFeature: _this.get('vectorDetailContent.viewData')
                                });
                                _this.get('vectorLayers')[newLayerSlug] = points;
                                points.addTo(map);
                            }
                            break;

                        case 'polygon':
                        case 'line-data':

                            let shapeColors = _this.get('dataColors.shapeColors');
                            newLayer.setProperties({
                                color_name: shapeColors[layer.get('marker')].name,
                                color_hex: shapeColors[layer.get('marker')].hex

                            });
                            // let layerClass = newLayerSlug + ' atLayer vectorData map-marker layer-' + newLayer.get('color_name');
                            let shapeLayerClass = newLayerSlug + ' vectorData map-marker layer-' + newLayer.get('color_name');
                            let vectorDiv = '<div class="map-marker vector-icon vector pull-left ' + dataType + ' layer-' + newLayer.get('color_name') + '"></div>';

                            let polyStyle = {
                                'color': newLayer.get('color_hex'),
                                'fillColor': newLayer.get('color_hex'),
                                'className': shapeLayerClass

                            };
                            if (newLayerUrl) {
                                var vector = new L.GeoJSON.AJAX(newLayerUrl, {
                                    style: polyStyle,
                                    className: shapeLayerClass,
                                    title: newLayerTitle,
                                    markerDiv: vectorDiv,
                                    onEachFeature: _this.get('vectorDetailContent.viewData'),
                                });
                                _this.get('vectorLayers')[newLayerSlug] = vector;
                                vector.addTo(map);
                            }
                            break;
                    }
                    break;
            }
        });
    },

    updateVectorStyle: function(vector) {
        let slug = vector.get('slug');
        let dataType = vector.get('data_type');
        if (dataType === 'polygon') {
            this.get('vectorLayers')[slug].setStyle({
                color: vector.get('color_hex'),
                fillColor: vector.get('color_hex')
            });
        } else if (dataType === 'line-data') {
            this.get('vectorLayers')[slug].setStyle({
                color: vector.get('color_hex')
            });
        } else if (dataType === 'point-data') {
            // The Icon class doesn't have any methods like setStyle.
            Ember.$('.leaflet-marker-icon.' + slug).css({
                color: vector.get('color_hex')
            });
        }
    }
});
