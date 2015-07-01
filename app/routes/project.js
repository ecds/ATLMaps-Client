import Ember from 'ember';
import DS from 'ember-data';
/* global Sortable */

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
	    	var layers = this.modelFor('project').get('layer_ids');

	        var project_id = this.modelFor('project').get('id');

	        var _this = this;

	        var controller = this.controllerFor('project');

            Ember.run.scheduleOnce('afterRender', function() {

                var map = _this.globals.mapObject;
                map.on('click', function(){
                    Ember.$("div.info").empty();
                    Ember.$(".active_marker").removeClass("active_marker");
                });

                var el = document.getElementById("layer_sort");
                Sortable.create(el, {
                    handle: '.handle',
                    animation: 150,
                    onUpdate: function (/**Event*/evt) {
                        console.log(evt.newIndex);
                    }
                });

            });

	        // Send some info to the ProjectController to 
	        // add the layers to the map.
            // And oh my, this is ugly!
	        Ember.$.each(layers.content.currentState, function(index, layer_id) {
	        	var layer = DS.PromiseObject.create({
            		promise: _this.store.find('layer', layer_id.id)
        		});

        		var savedMarker = DS.PromiseObject.create({
            		promise: _this.store.find('projectlayer', {
            			project_id: project_id, layer_id: layer_id.id
            		})
        		});

        		/*
					If we need to do anything to the promise objects we
					will need to add a `then` function. eg:
					`layer.then(function() {});`
        		*/

        		// Make an array of the above promise objects.
        		var promises = [layer, savedMarker];

        		// Once the promisies have been resolved, send them to the `mapLayer`
        		// action on the controler.
        		Ember.RSVP.allSettled(promises).then(function(){

        			// Good lord this is also really ugly.
        			var marker = savedMarker.content.content[0]._data.marker;
                    var position = savedMarker.content.content[0]._data.position;

        			controller.send('mapLayer',
	        			layer,
	        			marker,
                        position
	        		);

	        		Ember.run.scheduleOnce('afterRender', function() {
	        			controller.send('opacitySlider', layer, marker);
	        		});

	        		
        		});

	        });

	    },

        addLayer: function(layer){

            var project_id = this.modelFor('project').get('id');

            // Here we use `unshiftObject` instead of `pushObject` to prepend
            // the new layer to the list of layers.
            this.modelFor('project').get('layer_ids').unshiftObject(layer);

            var _this = this;

            var addedLayers = DS.PromiseObject.create({
                promise: _this.store.find('projectlayer', {
                    project_id: project_id
                })
            });

            addedLayers.then(function() {
                var position = addedLayers.get('length');

                var controller = _this.controllerFor('project');
                var colors = _this.globals.color_options;
                var marker = Math.floor((Math.random() * colors.length) + 1);
                var projectID = _this.get('controller.model.id');

                var projectlayer = _this.store.createRecord('projectlayer', {
                    project_id: projectID,
                    layer_id: layer.get('id'),
                    marker: marker,
                    layer_type: layer.get('layer_type'),
                    position: position
                });

                //projectlayer.save();

                controller.send('mapLayer',
                    layer,
                    marker,
                    position
                );

                Ember.$.each(addedLayers.content.content, function(index, layer_id) {

                    var layer = DS.PromiseObject.create({
                        promise: _this.store.find('layer', layer_id._data.layer_id)
                    });

                    var savedMarker = DS.PromiseObject.create({
                        promise: _this.store.find('projectlayer', {
                            project_id: project_id, layer_id: layer_id._data.layer_id
                        })
                    });

                    var promises = [layer, savedMarker];



                    Ember.RSVP.allSettled(promises).then(function(){
                        var marker = savedMarker.content.content[0]._data.marker;
                        controller.send('opacitySlider', layer, marker);
                    });
                });

                var newLayer = DS.PromiseObject.create({
                    promise: _this.store.find('layer', layer.get('id'))
                });

                newLayer.then(function(){

                    controller.send('opacitySlider', layer, marker);

                });

                

            });

        },

        reorderItems: function(newOrder) {
            console.log(newOrder.reverse());
        }

    },

    

    
});
