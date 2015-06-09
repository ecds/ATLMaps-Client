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
	    	var layers = this.modelFor('project').get('layer_ids');

	        var project_id = this.modelFor('project').get('id');

	        var _this = this;

	        var controller = this.controllerFor('project');

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

        			controller.send('mapLayer',
	        			layer,
	        			marker
	        		);

                    var layer_class = layer.get('layer');

	        		Ember.run.scheduleOnce('afterRender', function() {
	        			controller.send('opacitySlider', layer_class);
	        		});

	        		
        		});

	        });
	    },

    },

    

    
});
