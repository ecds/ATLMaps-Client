import Ember from 'ember';

/* globals L */

export default Ember.Service.extend({
    init(){
        this._super(...arguments);
        this.set('map', '');
    },
    createMap(lMap){
        this.setProperties({map: lMap});
    },
    mapLayer(layer){
        let map = this.get('map');
        let zIndex = layer.get('position') + 10;
        let markerColor = layer.get('color');
        // let slug = layer.get('raster_layer.slug');
        let newLayer = layer.get('raster_layer');

        switch(layer.get('raster_layer.layer_type')) {

            case 'planningatlanta':

                var tile = L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/' + newLayer.name + '/{z}/{x}/{y}.png', {
                    layer: newLayer.slug,
                    tms: true,
                    minZoom: 13,
                    maxZoom: 19,
                    detectRetina: true
                }).addTo(map).setZIndex(10).getContainer();

                Ember.$(tile).addClass(newLayer.slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                break;

                // case 'wms-c':
                //     alert('hello')
                //     var wmscURL = L.tileLayer('https://geo.library.gsu.edu/geowebcache/service/tms/1.0.0/' + layer.get('name') + '/{z}/{x}/{y}.png', {
                //         layer: layer.get('slug'),
                //         tms: true,
                //         minZoom: 13,
                //         maxZoom: 19,
                //         detectRetina: true
                //     }).addTo(map).setZIndex(10).getContainer();
                //
                //     Ember.$(wmscURL).addClass(slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);
                //
                //     break;

            case 'atlTopo':

                var topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/' + newLayer.slug + '/{z}/{x}/{y}.jpg', {
                    layer: newLayer.slug,
                    tms: true,
                    minZoom: 13,
                    maxZoom: 19,
                    detectRetina: true
                }).addTo(map).setZIndex(10).getContainer();

                Ember.$(topoTile).addClass(newLayer.slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                break;

            case 'wms':

                var wmsLayer = L.tileLayer.wms(newLayer.institution.geoserver + newLayer.workspace + '/wms', {
                    layers: newLayer.workspace + ':' + newLayer.name,
                    format: 'image/png',
                    crs: L.CRS.EPSG4326,
                    transparent: true,
                    detectRetina: true
                }).addTo(map).bringToFront().getContainer();

                Ember.$(wmsLayer).addClass(newLayer.slug).addClass('atLayer').css("zIndex", zIndex);

                break;

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

            case 'geojson':

                function viewData(feature, layer) {
                    var popupContent = "<h2>"+feature.properties.name+"</h2>";
                    if (feature.properties.image) {
                        popupContent += "<a href='"+feature.properties.image.url+"' target='_blank'><img class='geojson' src='"+feature.properties.image.url+"' title='"+feature.properties.image.name+"' /></a>"+
                        "<span>Photo Credit: "+feature.properties.image.credit+"</span>";

                        Ember.$('<img />').load( function(){}).attr('src', feature.properties.image.url);
                    }
                    if (feature.properties.gx_media_links) {
                        popupContent += '<iframe width="375" height="250" src="//' + feature.properties.gx_media_links + '?modestbranding=1&rel=0&showinfo=0&theme=light" frameborder="0" allowfullscreen></iframe>';
                    }
                    if (feature.properties.images) {
                        popupContent += feature.properties.images;
                    }
                    if (feature.properties.description) {
                        popupContent += "<p>" + feature.properties.description + "</p>";
                    }

                    layer.on('click', function() {
                        Ember.$(".project-nav").removeClass('active-button');
                        Ember.$(".project-nav").addClass('transparent-button');
                        Ember.$('#vector-data').addClass('active-button');
                        Ember.$("div.marker-content").empty();
                        Ember.$("div.marker-data").hide();
                        Ember.$(".card").hide();
                        var $content = Ember.$("<article/>").html(popupContent);
                        Ember.$("div.marker-data").show();
                        Ember.$('div.marker-content').append($content);

                        Ember.$(".active_marker").removeClass("active_marker");
                        Ember.$(this._icon).addClass('active_marker');
                    });

                }

                var polyStyle = {
                    'color': 'deeppink'
                };

                if(layer.get('url')){
                    var layerClass = newLayer.slug + ' atLayer vectorData map-marker layer-' + markerColor;
                    var vector = new L.GeoJSON.AJAX(newLayer.url, {
                        style: polyStyle,
                        className: layerClass,
                        pointToLayer: function (feature, latlng) {
                            var icon = L.divIcon({
                                className: layerClass,
                                iconSize: null,
                                html: '<div class="shadow"></div><div class="icon"></div>',
                                data: 'foo'
                            });

                            var marker = L.marker(latlng, {icon: icon});
                            return marker;
                        },
                        onEachFeature: viewData,
                    });
                    vector.addTo(map);
                }
                break;

            }
    }
});
