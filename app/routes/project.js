import Ember from 'ember';

/* global L */

export default Ember.Route.extend({

	mapObject: Ember.inject.service('map-object'),

	beforeModel: function(){

    },

	model(params){
		return this.store.find('project', params.project_id);
	},

	// setupController(controller, model){
    //     controller.set('project', model);
    // },

    afterModel: function(model) {
    	// Update the page title:
		// let project = models.project;
		// let layers = models.layers;
		let _this = this;
		model.get('vector_layer_project_ids').then(function(vectors){
			vectors.forEach(function(vector){
				_this.get('mapObject').mapLayer(vector);
			});
		});

		model.get('raster_layer_project_ids').then(function(rasters){
			rasters.forEach(function(raster){
				_this.get('mapObject').mapLayer(raster);
			});
		});
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

    actions: {

		willTransition(transition) {
			if (transition.targetName === 'project.browse-layers') {
				this.controllerFor('project').set('showBrowse', true);
			}
			else {
				this.controllerFor('project').set('showBrowse', false);
			}
			return true;
		},

    	didTransition: function() {

            var project = this.modelFor('project');

	        var _this = this;

			var map = this.get('mapObject').get('map');
			Ember.$('#map').show();
			map._onResize();

            Ember.run.scheduleOnce('afterRender', function() {
                _this.send('initProjectUI', _this.modelFor('project'));


                map.panTo(new L.LatLng(project.get('center_lat'), project.get('center_lng')));
                map.setZoom(project.get('zoom_level'));
			});
	    },

		showLayerInfoDetals: function(layer) {

			try {
                // Toggle the totally made up property!
                // The `!` in the second argument toggles the true/false state.
                this.set('clickedLayer.clicked', !this.get('clickedLayer.clicked'));
            }
            catch(err) {
                // The first time, clickedCategory will not be an instance
                // of `category`. It will just be `undefined`.
            }
            // So if the category that is clicked does not match the one in the
            // `clickedCategory` property, we set the `clicked` attribute to `true`
            // and that will remove the `hidden` class in the template.
            if (layer !== this.get('clickedLayer')){
                // Update the `clickedCategory` property
                this.set('clickedLayer', layer);
                // Set the model attribute
                layer.set('clicked', 'true');
            }
            // Otherwise, this must be the first time a user has clicked a category.
            else {
                 this.set('clickedLayer', true);
            }
		},

    },

});
