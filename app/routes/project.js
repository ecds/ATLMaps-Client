import Ember from 'ember';

/* globals L */

export default Ember.Route.extend({

	mapObject: Ember.inject.service('map-object'),
	dataColors: Ember.inject.service('data-colors'),

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

		var map = this.get('mapObject').get('map');
		map.panTo(new L.LatLng(model.get('center_lat'), model.get('center_lng')));

		let osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors Georgia State University and Emory University',
            detectRetina: true
        });

        let satellite = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
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
                satellite.addTo(map);
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
            "satellite": satellite
        };

        var control = L.control.layers(baseMaps,null,{collapsed:false});
		control._map = map;

		// We need to check if the layer controls are already added to the DOM.
        // if (Ember.$('.leaflet-control-layers').length === 0) {
            var controlDiv = control.onAdd(map);
            Ember.$('.base-layer-controls').append(controlDiv);
        // }
    },

	deactivate(){
		Ember.$('.atLayer').remove();
	},

	// setHeadTags: function (model) {
	// 	var headTags = [{
	// 		type: 'meta',
	// 		tagId: 'meta-description-tag',
	// 		attrs: {
	// 			property: 'og:description',
	// 			content: model.get('description')
	// 		}
	// 	}];
	//
	// 	this.set('headTags', headTags);
	//
	//  },

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
			// Ember.$('#map').show();
			// map._onResize();

            Ember.run.scheduleOnce('afterRender', function() {
                _this.send('initProjectUI', _this.modelFor('project'));

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

		addLayer(layer, format) {

            const project = this.modelFor('project');

            let layerToAdd = this.store.peekRecord(format+'_layer', layer.get('id'));

			let newLayer = '';
			switch(format) {
				case 'raster':
					let position = project.get('raster_layer_project_ids').get('length') + 1;

					newLayer = this.store.createRecord(format+'-layer-project', {
		                project_id: project.id,
		                raster_layer_id: layerToAdd,
		                data_format: layerToAdd.get('data_format'),
		                position: position
		            });
					break;

				case 'vector':
					let layerColor = '';
					switch(layerToAdd.get('data_type')){
						case 'point-data':
							let markerColors = this.get('dataColors.markerColors');
							layerColor = Math.floor((Math.random() * markerColors.length) + 1);
							break;
						case 'polygon':
						case 'line-data':
							let shapeColors = this.get('dataColors.shapeColors');
							layerColor = Math.floor((Math.random() * Object.keys(shapeColors).length) + 1);
					}



					newLayer = this.store.createRecord('vector-layer-project', {
						project_id: project.id,
						vector_layer_id: layerToAdd,
						data_format: layerToAdd.get('data_format'),
						marker: layerColor
					});
					break;
			}

            let _this = this;

            project.get(format+'_layer_project_ids').addObject(newLayer);

            newLayer.save().then(function(){
                // Add the map to the view
                _this.get('mapObject').mapLayer(newLayer);
                // Show a success message.
                _this.controllerFor('project/browse-layers').set('editSuccess', true);
                Ember.run.later(this, function(){
                    _this.controllerFor('project/browse-layers').set('editSuccess', false);
                }, 3000);
            }, function(){
                _this.controllerFor('project/browse-layers').set('editFail', true);
                Ember.run.later(this, function(){
                    _this.controllerFor('project/browse-layers').set('editFail', false);
                }, 3000);
            });

        },

        removeLayer(layer, format) {
			console.log(layer);
            const project = this.modelFor('project');
            let _this = this;
            // Get the join between layer and project
            this.store.queryRecord(format+'-layer-project', {
                project_id: project.id,
                raster_layer_id: layer.id
            }).then(function(layerToRemove){
                // Remove the object from the DOM
                project.get(format+'_layer_project_ids').removeObject(layerToRemove);
                // Delete the record from the project
                layerToRemove.destroyRecord().then(function(){
                    // Set active to false
                    layer.set('active_in_project', false);
                    _this.controllerFor('project/browse-layers').set('editSuccess', true);
                    Ember.run.later(this, function(){
                        _this.controllerFor('project/browse-layers').set('editSuccess', false);
                        // Remove the map from the view
                        Ember.$("."+layer.get('slug')).fadeOut( 500, function() {
                            Ember.$(this).remove();
                        });
                    }, 3000);
                }, function(){
                    _this.controllerFor('project/browse-layers').set('editFail', true);
                    Ember.run.later(this, function(){
                        _this.controllerFor('project/browse-layers').set('editFail', false);
                    }, 3000);
                });
            });
        },

    },

});
