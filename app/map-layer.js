import Ember from 'ember';

/* globals L */

var   color_options = ["amber-300","amber-400","amber-500","amber-600","blue-200","blue-300","blue-400","blue-500","blue-600","blue-700","blue-800","blue-900","cyan-200","cyan-300","cyan-400","cyan-500","cyan-600","cyan-700","cyan-800","cyan-900","deep-orange-300","deep-orange-400","deep-orange-500","deep-orange-600","deep-orange-700","deep-purple-300","deep-purple-400","deep-purple-50","deep-purple-500","deep-purple-600","green-300","green-400","green-500","green-600","indigo-400","indigo-500","indigo-600","indigo-700","light-blue-300","light-blue-400","light-blue-500","light-blue-600","light-blue-700","light-green-300","light-green-400","light-green-500","light-green-600","light-green-700","orange-300","orange-400","orange-500","orange-600","orange-700","pink-400","pink-500","pink-600","pink-700","purple-300","purple-400","purple-500","purple-600","purple-700","red-300","red-400","red-500","red-600","red-700","teal-300","teal-400","teal-500","teal-600","teal-700","yellow-400","yellow-500","yellow-600"];


export default function MapLayer(map, layer, marker_color, position){
    var slug = layer.get('slug');

    // Ember pulls from the cache and the so the order of the layers gets
    // messed up. So we add a `data-position` attribute that is with the
    // layer's positon in the current project and sort by it.
    Ember.$('.raster-layer#'+slug).attr('data-position', position);

    var institution = layer.get('institution');

    var markerColor = color_options[marker_color];

    Ember.$("#layer-list").append("<div>"+layer.get('name')+"</div>");

    var zIndex = position + 10;

    switch(layer.get('layer_type')) {

        case 'planningatlanta':

            var tile = L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/' + layer.get('name') + '/{z}/{x}/{y}.png', {
                layer: layer.get('slug'),
                tms: true,
                minZoom: 13,
                maxZoom: 19,
                detectRetina: true
            }).addTo(map).setZIndex(10).getContainer();

            Ember.$(tile).addClass(slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

            break;

            case 'wms-c':
                alert('hello')
                var wmscURL = L.tileLayer('https://geo.library.gsu.edu/geowebcache/service/tms/1.0.0/' + layer.get('name') + '/{z}/{x}/{y}.png', {
                    layer: layer.get('slug'),
                    tms: true,
                    minZoom: 13,
                    maxZoom: 19,
                    detectRetina: true
                }).addTo(map).setZIndex(10).getContainer();

                Ember.$(wmscURL).addClass(slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                break;

        case 'atlTopo':

            var topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/' + layer.get('slug') + '/{z}/{x}/{y}.jpg', {
                layer: layer.get('slug'),
                tms: true,
                minZoom: 13,
                maxZoom: 19,
                detectRetina: true
            }).addTo(map).setZIndex(10).getContainer();

            Ember.$(topoTile).addClass(slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

            break;

        case 'wms':

            var wmsLayer = L.tileLayer.wms(institution.geoserver + layer.get('workspace') + '/wms', {
                layers: layer.get('workspace') + ':' + layer.get('name'),
                format: 'image/png',
                crs: L.CRS.EPSG4326,
                transparent: true,
                detectRetina: true
            }).addTo(map).bringToFront().getContainer();

            Ember.$(wmsLayer).addClass(slug).addClass('atLayer').css("zIndex", zIndex);

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
                'color': 'red'
            };

            if(layer.get('url')){
                var layerClass = slug + ' atLayer vectorData map-marker layer-' + markerColor;
                var vector = new L.GeoJSON.AJAX(layer.get('url'), {
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
