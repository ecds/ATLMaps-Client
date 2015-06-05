import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
	model: function(params) {
        var project = this.store.find('project', params.project_id);
        return project;
    },

    afterModel: function() {
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
	        
	        Ember.$.each(layers, function(index, layer_id) {
	        	var layer = DS.PromiseObject.create({
            		promise: _this.store.find('layer', layer_id)
        		});
        
        		layer.then(function() {});

        		var savedMarker = DS.PromiseObject.create({
            		promise: _this.store.find('projectlayer', {
            			project_id: project_id, layer_id: layer_id
            		})
        		});

        		savedMarker.then(function() {}); 

        		// Make an array of the above promise objects.
        		var promises = [layer, savedMarker];

        		// Once the promisies have been resolved, send them to the `mapLayer`
        		// action on the controler.
        		Ember.RSVP.allSettled(promises).then(function(){

        			// Good lord I hate this.
        			var marker = savedMarker.content.content[0]._data.id;

        			controller.send('mapLayer',
	        			layer,
	        			marker
	        		);
        		});

	        });
	        
	    },

    },

    

    
});
