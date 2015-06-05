import Ember from 'ember';

/* global L */
/* global shuffle */


export default Ember.Controller.extend({

	actions: {
		// mapLayer expects `layer` to be a layer object.
		mapLayer: function(layer, marker_color){


			var slug = layer.get('layer');
			var map = this.globals.mapObject;
            
            var institution = layer.get('institution');
            
            switch(layer.get('layer_type')) {
                case 'planningatlanta':

                    var tile = L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/' + layer.get('layer') + '/{z}/{x}/{y}.png', {
                        layer: layer.get('layer'),
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();
                                        
                    Ember.$(tile).addClass(slug).addClass('wmsLayer');

                    break;
                
                case 'wms':
                
                    var wmsLayer = L.tileLayer.wms(institution.geoserver + layer.get('url') + '/wms', {
                        layers: layer.get('url') + ':' + layer.get('layer'),
                        format: 'image/png',
                        CRS: 'EPSG:900913',
                        transparent: true,
                        detectRetina: true
                    }).addTo(map).bringToFront().getContainer();
                                        
                    Ember.$(wmsLayer).addClass(slug);
                
                    break;
                
                case 'wfs':
                                    //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON&callback=jQuery21106192189888097346_1421268179487&_=1421268179488
                                    //http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text/javascript
                    var wfsLayer = institution.geoserver + layer.get('url') + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.get('url') + ":" + layer.get('layer') + "&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON";
                    
                    Ember.$.ajax(wfsLayer,
                      { dataType: 'jsonp' }
                    ).done(function ( data ) {});
                    
                    // This part is the magic that makes the JSONP work
                    // The string at the beginning of the JSONP is processJSON
                    function processJSON(data) {
                      points = wfsLayer(data,{
                        //onEachFeature: onEachFeature,
                        pointToLayer: function (feature, latlng) {
                          return L.marker(latlng);
                        }
                      }).addTo(map);
                    }
                    
                    break;
                
                case 'geojson':
                    
                    function viewData(feature, layer) {
                        var popupContent = "<h2>"+feature.properties.name+"</h2>";
                        if (feature.properties.image) {
                            popupContent += "<a href='"+feature.properties.image.url+"' target='_blank'><img class='geojson' src='"+feature.properties.image.url+"' title='"+feature.properties.image.name+"' /></a>"+
                                            "<span>Photo Credit: "+feature.properties.image.credit+"</span>";
                        }
                        if (feature.properties.description) {
                            popupContent += "<p>" + feature.properties.description + "</p>";
                        }
                        if (feature.properties.gx_media_links) {
                            popupContent += '<iframe width="375" height="250" src="//' + feature.properties.gx_media_links + '?modestbranding=1&rel=0&showinfo=0&theme=light" frameborder="0" allowfullscreen></iframe>';
                        }
                        if (feature.properties.images) {
                            popupContent += feature.properties.images;
                        }
                        //layer.bindPopup(popupContent);
                        layer.on('click', function(marker) {
                            Ember.$(".shuffle-items li.item.info").remove();
                            var $content = Ember.$("<div/>").attr("class","content").html(popupContent);
                            var $info = Ember.$('<li/>').attr("class","item info").append($content);
                            $info.appendTo(Ember.$(".shuffle-items"));
                            shuffle.click($info);

                            Ember.$(".active_marker").removeClass("active_marker");
                            Ember.$(this._icon).addClass('active_marker');
                        });
                        
                    }
                    function setIcon(url, class_name){
                        return iconObj === L.icon({
                            iconUrl: url,
                            iconSize: [25, 35],
                            iconAnchor: [16, 37],
                            //popupAnchor: [0, -28],
                            className: class_name
                        });
                    }
                    
                    if(layer.get('url')){
                      var points = new L.GeoJSON.AJAX(layer.get('url'), {
                          
                          pointToLayer: function (feature, latlng) {
                           var i = marker_color;
                           var layerClass = 'marker' + String(Counts.marker++) + ' ' + slug + ' vectorData map-marker layer-' + this.globals.color_options[i];
                           
                           var icon = L.divIcon({
                               className: layerClass,
                               iconSize: null,
                               html: '<div class="shadow"></div><div class="icon"></div>'
                           });
                           
                           var marker = L.marker(latlng, {icon: icon});   
                            
                            return marker;
                        },
                          
                          
                          onEachFeature: viewData,
                      }).addTo(map);
                      
                      
                    }
                      
                    break;
                    
            }
            
            shuffle.init();


		},
	}
});
