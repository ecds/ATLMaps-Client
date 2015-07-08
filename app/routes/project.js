import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({

	beforeModel: function(){

    },

    model: function(params) {
        var project = this.store.fetchById('project', params.project_id);
        //project.reload();
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

                controller.send('initProjectUI');

                console.log(map.getBounds());

            });

	        // Send some info to the ProjectController to 
	        // add the raster layers.
            // And oh my, this is ugly!
            Ember.$.each(raster_layers.content.currentState, function(index, raster_layer_id){
                var rasterLayer = DS.PromiseObject.create({
                    promise: _this.store.find('raster_layer', raster_layer_id.id)
                });

                var rasterLayerProjectInfo = DS.PromiseObject.create({
                    promise: _this.store.find('raster_layer_project', {
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

                    Ember.run.scheduleOnce('afterRender', function() {
                        controller.send('opacitySlider', rasterLayer);
                    });
                });


            });

            // Now send the vector layers
	        Ember.$.each(vector_layers.content.currentState, function(index, vector_layer_id) {
	        	var vectorLayer = DS.PromiseObject.create({
            		promise: _this.store.find('vector_layer', vector_layer_id.id)
        		});

        		var vectorLayerProjectInfo = DS.PromiseObject.create({
            		promise: _this.store.find('vector_layer_project', {
            			project_id: project_id, vector_layer_id: vector_layer_id.id
            		})
        		});

        		// Make an array of the above promise objects.
        		var vectorPromises = [vectorLayer, vectorLayerProjectInfo];

        		// Once the promisies have been resolved, send them to the `mapLayer`
        		// action on the controler.
        		Ember.RSVP.allSettled(vectorPromises).then(function(){

        			// Good lord this is also really ugly.
        			var marker = vectorLayerProjectInfo.content.content[0]._data.marker;

        			controller.send('mapLayer',
	        			vectorLayer,
	        			marker,
                        0
	        		);

	        		Ember.run.scheduleOnce('afterRender', function() {
	        			controller.send('colorIcons', vectorLayer, marker);
	        		});

	        		
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

                // Init the opacity slider for the new layer.
                controller.send('opacitySlider', layer);

                // This is unfortunate but we have to re-init the sliders for each layer
                // Ember.$.each(addedLayers.content.content, function(index, layer_id) {
                //     var projectLayer = DS.PromiseObject.create({
                //         promise: _this.store.find('layer', layer_id._data.raster_layer_id)
                //     });

                //     projectLayer.then(function() {
                //         controller.send('opacitySlider', projectLayer);
                //     });
                // });

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

        },

        removeRasterLayer: function(layer){
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

        },

        removeVectorLayer: function(layer){
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
            Ember.$("."+layerClass).fadeOut( 500, function() {
                Ember.$(this).remove();
            });

        },

        reorderItems: function() {
            
        },

        showLayerInfoDetals: function(layer) {
            if (Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
                Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
            }
            else if (!Ember.$(".layer-info-detail."+layer).hasClass("layer-info-detail-active")) {
                Ember.$(".layer-info-detail-active").slideToggle().removeClass("layer-info-detail-active");
                Ember.$(".layer-info-detail."+layer).slideToggle().addClass("layer-info-detail-active");
            }
        }

    },

    

    
});
