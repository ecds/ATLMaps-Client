import Ember from 'ember';
import DS from 'ember-data';

/* global L */
/* global shuffle */


export default Ember.Controller.extend({
	isShowingModal: false,

	layers: function() {

            var $loading_gif = Ember.$("<img/>").attr({'src':'/assets/images/loaders/Preloader_19.gif'});
            var $loading_message = Ember.$("<div/>").addClass("modal-loading-content").append($loading_gif);
            var $loading = Ember.$("<div/>").addClass("modal-loading").append($loading_message);

            var layers = DS.PromiseObject.create({
                promise: this.store.find('layer')
            });

            layers.then(function(){
                $loading.fadeOut(1500, function(){
                        Ember.$(this).remove();
                    });
            });

            return layers;


        }.property(),

		
  actions: {
   	toggleModal: function(){
      this.toggleProperty('isShowingModal');
    },
		// mapLayer expects `layer` to be a layer object.
		mapLayer: function(layer, marker_color){

	    console.log('made it');
		var slug = layer.get('layer');
		var map = this.globals.mapObject;

		var institution = layer.get('institution');

		var markerColor = this.globals.color_options[Math.floor(marker_color)];

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
					crs: L.CRS.EPSG4326,
					transparent: true,
					detectRetina: true
				}).addTo(map).bringToFront().getContainer();

				Ember.$(wmsLayer).addClass(slug);

				break;

			// case 'wfs':
			// 	//http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON&callback=jQuery21106192189888097346_1421268179487&_=1421268179488
			// 	//http://geospatial.library.emory.edu:8081/geoserver/Sustainability_Map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Sustainability_Map:Art_Walk_Points&maxFeatures=50&outputFormat=text/javascript
			// 	var wfsLayer = institution.geoserver + layer.get('url') + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.get('url') + ":" + layer.get('layer') + "&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON";

			// 	Ember.$.ajax(wfsLayer,
			// 		{ dataType: 'jsonp' }
			// 		).done(function ( data ) {});

			// 	// This part is the magic that makes the JSONP work
			// 	// The string at the beginning of the JSONP is processJSON
			// 	function processJSON(data) {
			// 		points = wfsLayer(data,{
			// 			//onEachFeature: onEachFeature,
			// 			pointToLayer: function (feature, latlng) {
			// 				return L.marker(latlng);
			// 			}
			// 		}).addTo(map);
			// 	}

			// 	break;

			case 'geojson':                    
				function viewData(feature, layer) {
					var popupContent = "<h2>"+feature.properties.name+"</h2>";
					if (feature.properties.image) {
						popupContent += "<a href='"+feature.properties.image.url+"' target='_blank'><img class='geojson' src='"+feature.properties.image.url+"' title='"+feature.properties.image.name+"' /></a>"+
						"<span>Photo Credit: "+feature.properties.image.credit+"</span>";

						Ember.$('<img />').load( function(){
  							shuffle.init();
						}).attr('src', feature.properties.image.url);
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
					layer.on('click', function() {
						Ember.$(".shuffle-items li.item.info").remove();
						var $content = Ember.$("<div/>").attr("class","content").html(popupContent);
						var $info = Ember.$('<li/>').attr("class","item info").append($content);
						$info.appendTo(Ember.$(".shuffle-items"));
						shuffle.click($info);

						Ember.$(".active_marker").removeClass("active_marker");
						Ember.$(this._icon).addClass('active_marker');
					});

				}

				if(layer.get('url')){
					new L.GeoJSON.AJAX(layer.get('url'), {

						pointToLayer: function (feature, latlng) {
							var layerClass = slug + ' vectorData map-marker layer-' + markerColor;
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

		opacitySlider: function(layer){

        	Ember.$(".slider."+layer).noUiSlider({
            	start: [ 10 ],
            	connect: false,
             	range: {
                	'min': 0,
                	'max': 10
              	}
            });
		},

		
	}
});
