import Ember from 'ember';
import DS from 'ember-data';

/* globals L */


export default Ember.Controller.extend({

    rasterLayers: function() {

        var rasterLayers = DS.PromiseObject.create({
            promise: this.store.find('raster-layer', {projectID: this.model.get('id')})
        });

        rasterLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return rasterLayers;


    }.property(),

    vectorLayers: function() {

        var vectorLayers = DS.PromiseObject.create({
            promise: this.store.find('vector-layer', {projectID: this.model.get('id')})
        });

        vectorLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return vectorLayers;


    }.property(),

    showingAllLayers: true,
        
    actions: {

      //   initProjectUI: function(model) {

      //       var _this = this;

      //       Ember.run.scheduleOnce('afterRender', function() {

      //           // Set up the map
      //           var map = _this.globals.mapObject;

      //           var osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      //               attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors Georgia State University and Emory University',
      //               detectRetina: true
      //           });
                
      //           var MapQuestOpen_Aerial = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
      //               attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency contributors Georgia State University and Emory University',
      //               subdomains: '1234',
      //               detectRetina: true
      //           });

      //           osm.addTo(map);
                        
      //           var baseMaps = {
      //               "Street": osm,
      //               "Satellite": MapQuestOpen_Aerial
      //           };        
                
      //           var control = L.control.layers(baseMaps,null,{collapsed:false});//.addTo(_map);
      //           control._map = map;

      //           // We need to check if the layer controls are already added to the DOM.
      //           if (Ember.$('.leaflet-control-layers').length === 0) {
      //               var controlDiv = control.onAdd(map);
      //               Ember.$('.controls').append(controlDiv);
      //           }

      //           // Initiate the dragging of the marker info.
      //           Ember.$('.draggable').draggabilly({
      //               handle: '.mdi-action-open-with'
      //           });

      //           var raster_layers = model.get('raster_layer_ids');

      //           Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
      //               var projectLayer = DS.PromiseObject.create({
      //                   promise: _this.store.find('raster_layer', raster_layer_id.id)
      //               });

      //               projectLayer.then(function() {
      //                   _this.send('opacitySlider', projectLayer);
      //               });
      //           });

      //       });

      //       // Ember.run.later(this, function() {

      //       //  var rasterLayerIDs = this.model.get('raster_layer_ids');

      //       //  console.log(rasterLayerIDs.content.currentState);

      //       //  Ember.$.each(rasterLayerIDs.content.currentState, function(index, layer_id) {
      // //               var rasterLayer = DS.PromiseObject.create({
      // //                   promise: _this.store.find('raster_layer', layer_id.id)
      // //               });

      // //               rasterLayer.then(function() {
      // //                //Ember.$(".slider."+rasterLayer.get('layer'))[0].destroy();
      // //                   _this.send('opacitySlider', rasterLayer);
      // //               });
      // //           });

      // //           var vectorLayerIDs = this.model.get('vector_layer_ids');

      //       //  Ember.$.each(vectorLayerIDs.content.currentState, function(index, layer_id) {
      //       //      console.log(layer_id.id);
      //       //  });
      //       // }, 1500);
      //   },

        // mapLayer expects `layer` to be a layer object.
        mapLayer: function(layer, marker_color, position){

            var slug = layer.get('layer');
            var map = this.globals.mapObject;

            // Ember pulls from the cache and the so the order of the layers gets
            // messed up. So we add a `data-position` attribute that is with the
            // layer's positon in the current project and sort by it.
            Ember.$('.raster-layer#'+slug).attr('data-position', position);

            var institution = layer.get('institution');

            var markerColor = this.globals.color_options[marker_color];

            Ember.$("#layer-list").append("<div>"+layer.get('name')+"</div>");

            var zIndex = position + 10;

            switch(layer.get('layer_type')) {
        
                case 'planningatlanta':

                    var tile = L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/' + layer.get('layer') + '/{z}/{x}/{y}.png', {
                        layer: layer.get('layer'),
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    Ember.$(tile).addClass(slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                    break;

                case 'atlTopo':

                    var topoTile = L.tileLayer('http://disc.library.emory.edu/atlanta1928topo/' + layer.get('layer') + '/{z}/{x}/{y}.jpg', {
                        layer: layer.get('layer'),
                        tms: true,
                        minZoom: 13,
                        maxZoom: 19,
                        detectRetina: true
                    }).addTo(map).setZIndex(10).getContainer();

                    Ember.$(topoTile).addClass(slug).addClass('wmsLayer').addClass('atLayer').css("zIndex", zIndex);

                    break;

                case 'wms':

                    var wmsLayer = L.tileLayer.wms(institution.geoserver + layer.get('url') + '/wms', {
                        layers: layer.get('url') + ':' + layer.get('layer'),
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
                //  var wfsLayer = institution.geoserver + layer.get('url') + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer.get('url') + ":" + layer.get('layer') + "&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback:processJSON";

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

                    if(layer.get('url')){
                        new L.GeoJSON.AJAX(layer.get('url'), {

                            pointToLayer: function (feature, latlng) {
                                var layerClass = slug + ' atLayer vectorData map-marker layer-' + markerColor;
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

        },

        // opacitySlider: function(layer){
        //     var _this = this;

        //     Ember.run.later(this, function() {

        //         var options = {
        //             start: [ 10 ],
        //             connect: false,
        //             range: {
        //                 'min': 0,
        //                 'max': 10
        //             }
        //         };
        //         var slider = document.getElementById(layer.get('slider_id'));

        //         try {
        //             slider.noUiSlider.destroy();
        //         }
        //         catch(err){}

        //         noUiSlider.create(slider, options, true);

        //         var valueInput = document.getElementById(layer.get('slider_value_id'));
        //         slider.noUiSlider.on('update', function(values, handle){
        //             valueInput.value = values[handle];
        //             var opacity = values[handle] / 10;
        //             Ember.$("#map div."+layer.get('layer')+",#map img."+layer.get('layer')).css({'opacity': opacity});
        //         });
        //         valueInput.addEventListener('change', function(){
        //             slider.noUiSlider.set(this.value);
        //         });

        //         var hideLayersButton = document.getElementById('hide-layers');
        //             hideLayersButton.addEventListener('click', function(){
        //                 slider.noUiSlider.set(0);
        //                 Ember.$('button#hide-layers').hide();
        //                 Ember.$('button#show-layers').show();
        //                 _this.set('showingAllLayers', false);
        //         });

        //         var showLayersButton = document.getElementById('show-layers');
        //             showLayersButton.addEventListener('click', function(){
        //                 slider.noUiSlider.set(10);
        //                 Ember.$('button#hide-layers').show();
        //                 Ember.$('button#show-layers').hide();
        //                 _this.set('showingAllLayers', true);
        //         });

        //     }, 2000);
        // },

        
        
    }
});
