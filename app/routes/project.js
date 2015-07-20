import Ember from 'ember';
import DS from 'ember-data';
/* globals noUiSlider */

export default Ember.Route.extend({

	beforeModel: function(){

    },

    model: function(params) {
        //var project = this.store.fetchById('project', params.project_id);
        var project = this.store.findRecord('project', params.project_id);
        return project;
    },

    afterModel: function() {
    	// Update the page title:
        var projectTitle = this.modelFor('project').get('name');
        Ember.$(document).attr('title', 'ATLMaps: ' + projectTitle);
    },

    actions: {

    	didTransition: function() {

	    	var raster_layers = this.modelFor('project').get('raster_layer_ids');

            var vector_layers = this.modelFor('project').get('vector_layer_ids');

	        var project_id = this.modelFor('project').get('id');

	        var _this = this;

	        var controller = this.controllerFor('project');

            Ember.run.scheduleOnce('afterRender', function() {

                var map = _this.globals.mapObject;
                map.on('click', function(){
                    Ember.$("div.info").remove();
                    Ember.$("div.marker-data").hide();
                    Ember.$(".active_marker").removeClass("active_marker");
                });

                var controller = _this.controllerFor('project');

                // controller.send('initProjectUI', _this.modelFor('project'));
                _this.send('initProjectUI', _this.modelFor('project'));

                console.log(map.getBounds());

    	        // Send some info to the ProjectController to 
    	        // add the raster layers.
                // And oh my, this is ugly!
                Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                    var rasterLayer = DS.PromiseObject.create({
                        promise: _this.store.find('raster_layer', raster_layer_id.id)
                    });

                    var rasterLayerProjectInfo = DS.PromiseObject.create({
                        promise: _this.store.query('raster_layer_project', {
                            project_id: project_id, raster_layer_id: raster_layer_id.id
                        })
                    });

                    /*
                        If we need to do anything to the promise objects we
                        will need to add a `then` function. eg:
                        `layer.then(function() {});`
                    */

                    // Make an array of the above promise objects.
                    var rasterPromises = [rasterLayer, rasterLayerProjectInfo];

                    // Once the promisies have been resolved, send them to the `mapLayer`
                    // action on the controler.
                    Ember.RSVP.allSettled(rasterPromises).then(function(){
                        var position = rasterLayerProjectInfo.content.content[0]._data.position;

                        controller.send('mapLayer',
                            rasterLayer,
                            0,
                            position
                        );

                        Ember.$('.raster-layer#'+rasterLayer.get('layer')).attr('data-position', position);

                        var list = Ember.$('#layer_sort');
                        var listItems = list.find('div.raster-layer').sort(function(a,b){
                                return Ember.$(b).attr('data-position') - Ember.$(a).attr('data-position');
                            });
                        list.find('div.raster-layer').remove();
                        list.append(listItems);
                    });
                });

            });

            // Now send the vector layers
	        Ember.$.each(vector_layers.content.currentState, function(index, vector_layer_id) {
	        	var vectorLayer = DS.PromiseObject.create({
            		promise: _this.store.find('vector_layer', vector_layer_id.id)
        		});

        		var vectorLayerProjectInfo = DS.PromiseObject.create({
            		promise: _this.store.query('vector_layer_project', {
            			project_id: project_id, vector_layer_id: vector_layer_id.id
            		})
        		});

        		// Make an array of the above promise objects.
        		var vectorPromises = [vectorLayer, vectorLayerProjectInfo];

        		// Once the promisies have been resolved, send them to the `mapLayer`
        		// action on the controler.
        		Ember.RSVP.allSettled(vectorPromises).then(function(){

        			// Good lord this is also really ugly.
        			//var marker = vectorLayerProjectInfo.content.content[0]._data.marker;
                    var marker = vectorLayerProjectInfo.get('firstObject')._internalModel._data.marker;

        			controller.send('mapLayer',
	        			vectorLayer,
	        			marker,
                        0
	        		);

	        		//Ember.run.scheduleOnce('afterRender', function() {
	        			controller.send('colorIcons', vectorLayer, marker);
	        		//});

	        		
        		});

	        });

	    },

        addRasterLayer: function(layer) {
            var project_id = this.modelFor('project').get('id');

            layer.set('active_in_project', true);
            //this.toggleProperty('active_in_project');

            // Here we use `unshiftObject` instead of `pushObject` to prepend
            // the new layer to the list of layers.
            this.modelFor('project').get('raster_layer_ids').unshiftObject(layer);

            var _this = this;

            var addedLayers = DS.PromiseObject.create({
                promise: _this.store.find('raster-layer-project', {
                    project_id: project_id
                })
            });

            addedLayers.then(function() {
                
                // Get the length of the layers and use that as
                // the position.
                var position = addedLayers.get('length');

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
                // controller.send('initProjectUI', _this.modelFor('project'));
                _this.send('initProjectUI', _this.modelFor('project'));

            });
        
        },

        addVectorLayer: function(layer){

            var project_id = this.modelFor('project').get('id');

            layer.set('active_in_project', true);

            // Here we use `unshiftObject` instead of `pushObject` to prepend
            // the new layer to the list of layers.
            this.modelFor('project').get('vector_layer_ids').unshiftObject(layer);

            var _this = this;

            var controller = _this.controllerFor('project');
            var colors = _this.globals.color_options;
            var marker = Math.floor((Math.random() * colors.length) + 1);
            var projectID = _this.get('controller.model.id');

            var vectorLayerProject = _this.store.createRecord('vector_layer_project', {
                project_id: projectID,
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
                        controller.send('colorIcons', layer, marker);
                    });
                });

                var newLayer = DS.PromiseObject.create({
                    promise: _this.store.find('layer', layer.get('id'))
                });

                newLayer.then(function(){
                    controller.send('colorIcons', layer, marker);
                });

            });
            
            // controller.send('initProjectUI', this.modelFor('project'));
            this.send('initProjectUI', this.modelFor('project'));

        },

        remvoeRasterLayer: function(layer){
            layer.set('active_in_project', false);
            var projectID = this.modelFor('project').get('id');
            var layerID = layer.get('id');
            var layerClass = layer.get('layer');
            var _this = this;

            this.modelFor('project').get('raster_layer_ids').removeObject(layer);

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

            var controller = _this.controllerFor('project');
            // controller.send('initProjectUI', _this.modelFor('project'));
            this.send('initProjectUI', this.modelFor('project'));

        },

        removeRasterLayer: function(layer){
            layer.set('active_in_project', false);
            var projectID = this.modelFor('project').get('id');
            var layerID = layer.get('id');
            var layerClass = layer.get('layer');

            var _this = this;

            this.modelFor('project').get('raster_layer_ids').removeObject(layerID);

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
            layer.set('active_in_project', false);
            var projectID = this.modelFor('project').get('id');
            var layerID = layer.get('id');
            var layerClass = layer.get('layer');

            var _this = this;

            this.modelFor('project').get('vector_layer_ids').removeObject(layer);

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

        initProjectUI: function(model) {

            var _this = this;

            Ember.run.scheduleOnce('afterRender', function() {

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

                osm.addTo(map);
                        
                var baseMaps = {
                    "Street": osm,
                    "Satellite": MapQuestOpen_Aerial
                };        
                
                var control = L.control.layers(baseMaps,null,{collapsed:false});//.addTo(_map);
                control._map = map;

                // We need to check if the layer controls are already added to the DOM.
                if (Ember.$('.leaflet-control-layers').length === 0) {
                    var controlDiv = control.onAdd(map);
                    Ember.$('.controls').append(controlDiv);
                }

                // Initiate the dragging of the marker info.
                Ember.$('.draggable').draggabilly({
                    handle: '.mdi-action-open-with'
                });

                var raster_layers = model.get('raster_layer_ids');

                Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                    var projectLayer = DS.PromiseObject.create({
                        promise: _this.store.find('raster_layer', raster_layer_id.id)
                    });

                    projectLayer.then(function() {
                        _this.send('opacitySlider', projectLayer);
                    });
                });

                // Toggle the label for the show/hide all layers switch
                Ember.$("input#toggle-layer-opacity").change(function(){
                    Ember.$( "span.toggle_label" ).toggleClass( "off" );
                });

                


            });
        },

        opacitySlider: function(layer){
            //var _this = this;

            Ember.run.later(this, function() {

                var options = {
                    start: [ 10 ],
                    connect: false,
                    range: {
                        'min': 0,
                        'max': 10
                    }
                };
                var slider = document.getElementById(layer.get('slider_id'));

                try {
                    slider.noUiSlider.destroy();
                }
                catch(err){}

                noUiSlider.create(slider, options, true);

                var valueInput = document.getElementById(layer.get('slider_value_id'));
                slider.noUiSlider.on('update', function(values, handle){
                    valueInput.value = values[handle];
                    var opacity = values[handle] / 10;
                    Ember.$("#map div."+layer.get('layer')+",#map img."+layer.get('layer')).css({'opacity': opacity});
                });
                valueInput.addEventListener('change', function(){
                    slider.noUiSlider.set(this.value);
                });

                var showHideSwitch = document.getElementById('toggle-layer-opacity');
                showHideSwitch.addEventListener('click', function(){
                    if (Ember.$("input#toggle-layer-opacity").prop("checked")){
                        slider.noUiSlider.set(10);
                    }
                    else{
                        slider.noUiSlider.set(0);
                    }
                });

            }, 2000);
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


    },

    

    
});
