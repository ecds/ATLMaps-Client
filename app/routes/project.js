import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
	model: function(params) {
        var project = this.store.find('project', params.project_id);
        return project;
    },

    afterModel: function() {
    	// Update the page title:
        var projectTitle = this.modelFor('project').get('name');
        Ember.$(document).attr('title', 'ATLMaps: ' + projectTitle);
    },

    actions: {
    	didTransition: function() {
    		/*
			The json representation for a project has two arrays
			for the associated layers. `layers` is just a simple
			array and `layer_ids` represents the association.
			This is awesome, but as we are looking up the layers
			twice. The way that Ember Data represents the association
			here makes it hard to iterate over them to send to the 
			`mapLayer` action. :(
    		*/
	    	var layers = this.modelFor('project').get('layers');
	        var project_id = this.modelFor('project').get('id');

	        var _this = this;
	        var controller = this.controllerFor('project');

	        // Send some info to the ProjectController to 
	        // add the layers to the map.
	        
	        Ember.$.each(layers, function(index, layer_id) {
	        	var layer = DS.PromiseObject.create({
            		promise: _this.store.find('layer', layer_id)
        		});

        		var savedMarker = DS.PromiseObject.create({
            		promise: _this.store.find('projectlayer', {
            			project_id: project_id, layer_id: layer_id
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

        			// Good lord I hate this.
        			var marker = savedMarker.content.content[0]._data.marker;

        			controller.send('mapLayer',
	        			layer,
	        			marker
	        		);

                    var layer_class = layer.get('layer');

	        		Ember.run.scheduleOnce('afterRender', function() {
	        			//var layer_class = this.layer.get('layer');

	        			controller.send('opacitySlider', layer_class);
	        		});

	        		
        		});

	        });
	    },

    },

    

    
});
