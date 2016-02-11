import Ember from 'ember';
import DS from 'ember-data';
import MapLayer from '../../map-layer';

/* global L */

export default Ember.Route.extend({

	beforeModel: function(){

    },

    // model: function(params) {
    //     return this.store.findRecord('project', params.project_id);
    // },

    afterModel: function(model) {
    	// Update the page title:
        var projectTitle = model.get('name');
        Ember.$(document).attr('title', 'ATLMaps: ' + projectTitle);

		this.setHeadTags(model);
		// this.transitionTo('project.info');
    },

	setHeadTags: function (model) {
		var headTags = [{
			type: 'meta',
			tagId: 'meta-description-tag',
			attrs: {
				property: 'og:description',
				content: model.get('description')
			}
		}];

		this.set('headTags', headTags);
	 },

	 showProjIntroModal: true,

    actions: {

    	didTransition: function() {

	    	var raster_layers = this.modelFor('project').get('raster_layer_ids');

            var vector_layers = this.modelFor('project').get('vector_layer_ids');

            var project = this.modelFor('project');

            var project_id = project.get('id');

	        var _this = this;

            Ember.run.scheduleOnce('afterRender', function() {
                _this.send('initProjectUI', _this.modelFor('project'));
				var map = _this.globals.mapObject;
                // just leaving this here so I remember how to do it.
                // console.log(map.getBounds());
                map.panTo(new L.LatLng(project.get('center_lat'), project.get('center_lng')));
                map.setZoom(project.get('zoom_level'));

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


                    // If we need to do anything to the promise objects we
                    // will need to add a `then` function. eg:
                    // `layer.then(function() {});`

                    // Make an array of the above promise objects.
                    var rasterPromises = [rasterLayer, rasterLayerProjectInfo];

                    // _this the promisies have been resolved, send them to the `mapLayer`
                    // action on the controler.
                    Ember.RSVP.allSettled(rasterPromises).then(function(){
                        var position = rasterLayerProjectInfo.content.content[0]._data.position;

                        // Only add the to the map if it donesn't already exixt in the DOM
                        // This is to prevent layers from adding more than one instance when
                        // transitioning between veiw and edit.
                        if (Ember.$('.atLayer.'+rasterLayer.get('slug')).length === 0) {
							new MapLayer(map, rasterLayer, 0, position);
                        }

                        //_this.send('orderRasterLayers');
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

        		// _this the promisies have been resolved, send them to the `mapLayer`
        		// action on the controler.
        		Ember.RSVP.allSettled(vectorPromises).then(function(){
					var map = _this.globals.mapObject;

        			// Good lord this is also really ugly.
        			// var marker = vectorLayerProjectInfo.content.content[0]._data.marker;
                    var marker = vectorLayerProjectInfo.get('firstObject')._internalModel._data.marker;

                    // Only add the to the map if it donesn't already exixt in the DOM
                    // This is to prevent layers from adding more than one instance when
                    // transitioning between veiw and edit.
                    if (Ember.$('.atLayer.'+vectorLayer.get('slug')).length === 0) {
						new MapLayer(map, vectorLayer, marker, 0);
                    }

	        		// _this.send('colorIcons', vectorLayer, marker);


        		});

	        });

	    },

    },

});
