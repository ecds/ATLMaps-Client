import Ember from 'ember';
import DS from 'ember-data';
/* globals L, Draggabilly */

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		initProjectUI: function(model) {
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

				// If we want to add OSM's 3D buildings.
				// Add `OSMBuildings` to the globals
				// var buildings = new OSMBuildings(map).load();

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
					Ember.$(".browse-results").fadeOut();
                    _this.send('activateVectorCard');
                });

                // Iniatate the dragging
                var draggie = new Draggabilly( '.draggable', {
                    handle: '.drag-window'
                });

                // Draggabilly adds a style of position = relative to the
                // element. This prevents the abality to click through where
                // the div was originally. So we change it to absolute.
                draggie.element.style.position = 'absolute';

                draggie.on( 'dragStart', function( /* event, pointer*/ ) {});

                Ember.$('.marker-data').resizeThis({ noNative: true });

                // var raster_layers = model.get('raster_layer_ids');

                // Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                //     var projectLayer = DS.PromiseObject.create({
                //         promise: _this.store.query('raster_layer', raster_layer_id.id)
                //     });
				//
                // });

                // Toggle the label for the show/hide all layers switch
                Ember.$("input#toggle-layer-opacity").change(function(){
                    Ember.$( "span.toggle_label" ).toggleClass( "off" );
                });

            //});

        },

        addRasterLayer: function(layer) {
            // Get the current route so we handle requests coming from both
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
                promise: _this.store.query('raster-layer-project', {
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
                // var controller = _this.controllerFor('projects.project.index');
                // controller.send('mapLayer',
                //     layer,
                //     0,
                //     position
                // );

				// var foo = new MapLayer();

                _this.send('initProjectUI', _this.modelFor(route));

            });

        },

        addVectorLayer: function(layer){

            // Get the current route so we handle requests coming from both
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

            // var controller = this.controllerFor('project.project');
            var colors = this.globals.color_options;
            var marker = Math.floor((Math.random() * colors.length) + 1);

            var vectorLayerProject = _this.store.createRecord('vector-layer-project', {
                project_id: project_id,
                vector_layer_id: layer.get('id'),
                marker: marker,
                layer_type: layer.get('layer_type'),
            });

			// Don't save if this is the exploer project.
			vectorLayerProject.save();


            // controller.send('mapLayer',
            //     layer,
            //     marker,
            //     0
            // );
			// var foo = new MapLayer();

        },

        removeRasterLayer: function(layer){
            // Get the current route so we handle requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');

            layer.set('active_in_project', false);
            var projectID = this.modelFor(route).get('id');
            var layerID = layer.get('id');
            var layerClass = layer.get('slug');

            var _this = this;

            this.modelFor(route).get('raster_layer_ids').removeObject(layer);

            var rasterLayerProject = DS.PromiseObject.create({
                promise: this.store.query('raster_layer_project', {
                    raster_layer_id: layerID, project_id: projectID
                })
            });

            rasterLayerProject.then(function(){
				console.log(rasterLayerProject);
                var rasterLayerProjectID = rasterLayerProject.get('content.content.0.id');

                _this.store.findRecord('raster_layer_project', rasterLayerProjectID).then(function(rasterLayerProject){
                    rasterLayerProject.destroyRecord().then(function(){});
                });
            });

            // Remove the layer from the map
            Ember.$(".leaflet-layer."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

            // var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            // this.send('initProjectUI', this.modelFor(route));

        },

        removeVectorLayer: function(layer){
            // Get the current route so we handle requests coming from both
            // `explore` and `project.edit`
            var route = this.controller.currentRouteName;
            // But we don't want the `.edit` junk on `route` when doing lookups.
            route = route.replace('\.edit', '');

            var projectID = this.modelFor(route).get('id');
            layer.set('active_in_project', false);
            var layerID = layer.get('id');
            var layerClass = layer.get('slug');

            var _this = this;

            this.modelFor(route).get('vector_layer_ids').removeObject(layer);

            var vectorLayerProject = DS.PromiseObject.create({
                promise: this.store.query('vector_layer_project', {
                    vector_layer_id: layerID, project_id: projectID
                })
            });

            vectorLayerProject.then(function(){
                var vectorLayerProjectID = vectorLayerProject.get('content.content.0.id');

                _this.store.findRecord('vector_layer_project', vectorLayerProjectID).then(function(vectorLayerProject){
                    vectorLayerProject.destroyRecord().then(function(){});
                });
            });

            // Remove the layer from the map
            Ember.$(".leaflet-marker-icon."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

            // var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            // this.send('initProjectUI', this.modelFor(route));

        },


        // colorIcons: function(layer, marker){
		//
        // },

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

 	}
});
