import Ember from 'ember';
import DS from 'ember-data';
/* globals L, noUiSlider, Draggabilly */

import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		initProjectUI: function(model) {
			console.log(model)
            var _this = this;

            //Ember.run.scheduleOnce('afterRender', function() {


                // Set up the map
                var map = _this.globals.mapObject;

                var osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors Georgia State University and Emory University',
                    detectRetina: true
                });

                var MapQuestOpen_Aerial = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency contributors Georgia State University and Emory University',
                    subdomains: '1234',
                    detectRetina: true
                });

                // var normal = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day.grey.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
                //     attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
                //     subdomains: '1234',
                //     mapID: 'newest',
                //     app_id: '1Igi60ZMWDeRNyjXqTZo',
                //     app_code: 'eA64oCoCX3KZV8bwLp92uQ',
                //     base: 'base',
                //     maxZoom: 20
                // });

                try {
					if (model.get('default_base_map') === 'satellite') {
                    	MapQuestOpen_Aerial.addTo(map);
                	}
	                else {
	                    osm.addTo(map);
	                }
				}
				catch(err) {
					osm.addTo(map);
				}

                var baseMaps = {
                    "street": osm,
                    "satellite": MapQuestOpen_Aerial
                };

                var control = L.control.layers(baseMaps,null,{collapsed:false});//.addTo(_map);
                control._map = map;

                // We need to check if the layer controls are already added to the DOM.
                if (Ember.$('.leaflet-control-layers').length === 0) {
                    var controlDiv = control.onAdd(map);
                    Ember.$('.base-layer-controls').append(controlDiv);
                }

				// Add a listiner for a click on the map to clear the
                // info window.
                map.on('click', function(){
                    Ember.$("div.info").remove();
                    Ember.$("div.marker-data").hide();
                    Ember.$(".active_marker").removeClass("active_marker");
                    _this.send('activateVectorCard');
                });

                // Iniatate the dragging
                var draggie = new Draggabilly( '.draggable', {
                    handle: '.mdi-action-open-with'
                });

                // Draggabilly adds a style of position = relative to the
                // element. This prevents the abality to click through where
                // the div was originally. So we change it to absolute.
                draggie.element.style.position = 'absolute';

                draggie.on( 'dragStart', function( /* event, pointer*/ ) {});

                Ember.$('.marker-data').resizeThis({ noNative: true });

                var raster_layers = model.get('raster_layer_ids');

                Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                    var projectLayer = DS.PromiseObject.create({
                        promise: _this.store.find('raster_layer', raster_layer_id.id)
                    });

                    projectLayer.then(function() {
                        // _this.send('opacitySlider', projectLayer);
                        _this.send('sort', projectLayer);
                    });
                });

                // Toggle the label for the show/hide all layers switch
                Ember.$("input#toggle-layer-opacity").change(function(){
                    Ember.$( "span.toggle_label" ).toggleClass( "off" );
                });

            //});

        },

        sort: function(layer){
        	Ember.run.later(this, function() {
	        	var project_id = this.modelFor('project').get('id');

	        	var projectLayer = DS.PromiseObject.create({
	                promise: this.store.query('raster_layer_project', {raster_layer_id: layer.get('id'), project_id: project_id})
	            });

	            projectLayer.then(function() {
	            	var position = projectLayer.get('firstObject')._internalModel._data.position;
	            	Ember.$('.raster-layer#'+layer.get('layer')).attr('data-position', position);

	            	// This sorts all the raster layers by the `data-position` attribute.
		            var list = Ember.$('#layer_sort');
		            var listItems = list.find('div.raster-layer').sort(function(a,b){
		                return Ember.$(b).attr('data-position') - Ember.$(a).attr('data-position');
		            });
		            list.find('div.raster-layer').remove();
		            list.append(listItems);
	            });
	        }, 2000);

        },

        opacitySlider: function(layer){

            Ember.run.later(this, function() {

                // var options = {
                //     start: [ 10 ],
                //     connect: false,
                //     range: {
                //         'min': 0,
                //         'max': 10
                //     }
                // };
                // var slider = document.getElementById(layer.get('slider_id'));
				//
                // // The slider drops out when we transition but noUiSlider thinks
                // // the slider has already been initialized. So, if the slider is
                // // "initalized", we destroy. Otherwise, we just initalize it.
                // try {
                //     slider.noUiSlider.destroy();
                // }
                // catch(err){/* don't care */}
				//
                // try {
                // 	noUiSlider.create(slider, options, true);
                // }
            	// catch(err){/* again, don't care*/}
				//
                // // Change the opactity when a user moves the slider.
                // var valueInput = document.getElementById(layer.get('slider_value_id'));
                // try {
	            //     slider.noUiSlider.on('update', function(values, handle){
	            //         valueInput.value = values[handle];
	            //         var opacity = values[handle] / 10;
	            //         Ember.$("#map div."+layer.get('layer')+",#map img."+layer.get('layer')).css({'opacity': opacity});
	            //     });
	            // }
	        	// catch(err){/* still don't care */}
	        	// try {
	            //     valueInput.addEventListener('change', function(){
	            //         slider.noUiSlider.set(this.value);
	            //     });
	            // }
	        	// catch(err){/* for real don't care */}
				//
                // // Watch the toggle check box to show/hide all raster layers.
                // var showHideSwitch = document.getElementById('toggle-layer-opacity');
                // showHideSwitch.addEventListener('click', function(){
                //     if (Ember.$("input#toggle-layer-opacity").prop("checked")){
                //         slider.noUiSlider.set(10);
                //     }
                //     else{
                //         slider.noUiSlider.set(0);
                //     }
                // });

            }, 2000);

            // var map = this.globals.mapObject;

            // map.eachLayer(function (layer) {
            //     console.log(layer);
            // });
        },

        addRasterLayer: function(layer) {
			// console.log(layer);
            // Get the current route so we handel requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');

            var project_id = this.modelFor(route).get('id');

            layer.set('active_in_project', true);
            //this.toggleProperty('active_in_project');

            // Here we use `unshiftObject` instead of `pushObject` to prepend
            // the new layer to the list of layers.
            this.modelFor(route).get('raster_layer_ids').unshiftObject(layer);

            var _this = this;

            var addedLayers = DS.PromiseObject.create({
                promise: _this.store.find('raster-layer-project', {
                    project_id: project_id
                })
            });

            addedLayers.then(function() {

                // To get the position,
                var position = 0;
                var newPosition = parseInt(Ember.$("[data-position]").attr('data-position')) + 1;
                if (!isNaN(newPosition)) {
                    position = newPosition;
                }

                var rasterLayerProject = _this.store.createRecord('raster-layer-project', {
                    project_id: project_id,
                    raster_layer_id: layer.get('id'),
                    layer_type: layer.get('layer_type'),
                    position: position
                });

                rasterLayerProject.save();


                // Send the layer to the action on the controller
                // to add it to the map.
                // The `mapLayer` action expects a parameter for
                // the marker so the `0` is a placeholder.
                var controller = _this.controllerFor('project');
                controller.send('mapLayer',
                    layer,
                    0,
                    position
                );

                _this.send('initProjectUI', _this.modelFor(route));

            });

        },

        addVectorLayer: function(layer){

            // Get the current route so we handel requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');

            var project_id = this.modelFor(route).get('id');

            layer.set('active_in_project', true);

            // Here we use `unshiftObject` instead of `pushObject` to prepend
            // the new layer to the list of layers.
            this.modelFor(route).get('vector_layer_ids').unshiftObject(layer);

            var _this = this;

            var controller = _this.controllerFor('project');
            var colors = _this.globals.color_options;
            var marker = Math.floor((Math.random() * colors.length) + 1);

            var vectorLayerProject = _this.store.createRecord('vector-layer-project', {
                project_id: project_id,
                vector_layer_id: layer.get('id'),
                marker: marker,
                layer_type: layer.get('layer_type'),
            });

            vectorLayerProject.save();

            controller.send('mapLayer',
                layer,
                marker,
                0
            );

            var addedLayers = DS.PromiseObject.create({
                promise: _this.store.find('vector_layer_project', {
                    project_id: project_id
                })
            });

            addedLayers.then(function() {

                Ember.$.each(addedLayers.content.content, function(index, layer_id) {

                    var layer = DS.PromiseObject.create({
                        promise: _this.store.find('layer', layer_id._data.vector_layer_id)
                    });

                    var savedMarker = DS.PromiseObject.create({
                        promise: _this.store.find('vector_layer_project', {
                            project_id: project_id, vector_layer_id: layer_id._data.vector_layer_id
                        })
                    });

                    var promises = [layer, savedMarker];

                    Ember.RSVP.allSettled(promises).then(function(){
                        var marker = savedMarker.content.content[0]._data.marker;
                        _this.send('colorIcons', layer, marker);
                    });
                });

                var newLayer = DS.PromiseObject.create({
                    promise: _this.store.find('layer', layer.get('id'))
                });

                newLayer.then(function(){
                    _this.send('colorIcons', layer, marker);
                });

            });

        },

        removeRasterLayer: function(layer){
            // Get the current route so we handel requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');

            layer.set('active_in_project', false);
            var projectID = this.modelFor(route).get('id');
            var layerID = layer.get('id');
            var layerClass = layer.get('layer');

            var _this = this;

            this.modelFor(route).get('raster_layer_ids').removeObject(layerID);

            var rasterLayerProject = DS.PromiseObject.create({
                promise: this.store.find('raster_layer_project', {
                    raster_layer_id: layerID, project_id: projectID
                })
            });

            rasterLayerProject.then(function(){
                var rasterLayerProjectID = rasterLayerProject.get('content.content.0.id');

                _this.store.find('raster_layer_project', rasterLayerProjectID).then(function(rasterLayerProject){
                    rasterLayerProject.destroyRecord().then(function(){});
                });
            });

            // Remove the layer from the map
            Ember.$("."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

            // var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            this.send('initProjectUI', this.modelFor('project'));

        },

        removeVectorLayer: function(layer){
            // Get the current route so we handel requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');

            var projectID = this.modelFor(route).get('id');
            layer.set('active_in_project', false);
            var layerID = layer.get('id');
            var layerClass = layer.get('layer');

            var _this = this;

            this.modelFor(route).get('vector_layer_ids').removeObject(layer);

            var vectorLayerProject = DS.PromiseObject.create({
                promise: this.store.find('vector_layer_project', {
                    vector_layer_id: layerID, project_id: projectID
                })
            });

            vectorLayerProject.then(function(){
                var vectorLayerProjectID = vectorLayerProject.get('content.content.0.id');

                _this.store.find('vector_layer_project', vectorLayerProjectID).then(function(vectorLayerProject){
                    vectorLayerProject.destroyRecord().then(function(){});
                });
            });

            // Remove the layer from the map
            Ember.$(".leaflet-marker-icon."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

            // var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            this.send('initProjectUI', this.modelFor('project'));

        },

        showLayerInfoDetals: function(layer) {
            if (Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
                Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
            }
            else if (!Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
                Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
                Ember.$(".layer-info-detail."+layer).slideToggle().addClass("layer-info-detail-active");
            }
        },

        closeMarkerInfo: function() {
            Ember.$("div.marker-data").hide();
            Ember.$(".active_marker").removeClass("active_marker");
            Ember.$(".vector-data.card").slideToggle();
            this.sendAction('activateVectorCard');
        },

        colorIcons: function(layer, marker){
            Ember.run.later(this, function() {
                Ember.$("span.geojson."+layer.get('layer_type')+"."+layer.get('layer')).addClass("map-marker layer-"+this.globals.color_options[marker]);
            }, 1500);
        },

        snapBack: function(){
            Ember.$(".draggable").animate({left: '0', top:'0', width: '420px'}, 100);
        },

        activateVectorCard: function(){

            Ember.$(".project-nav").removeClass('active-button');

            Ember.$(".project-nav").addClass('transparent-button');

            if (Ember.$(".card:visible").length === 0) {
                Ember.$('.vector-data').slideToggle();
                Ember.$('#vector-data').removeClass('transparent-button');
                Ember.$('#vector-data').addClass('active-button');
            }
        },


 	}
});