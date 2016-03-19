import Ember from 'ember';

/* globals L */

export default Ember.Route.extend({

	mapObject: Ember.inject.service('map-object'),
	dataColors: Ember.inject.service('data-colors'),
	browseParams: Ember.inject.service('browse-params'),

	beforeModel: function(){

    },

	model(params){
		if (params.project_id === 'explore') {
			return this.store.createRecord('project', {
                name: 'Explore',
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13,
                default_base_map: 'street',
				exploring: true,
				description: 'Here we say something about how they can play around but nothing will be saved.'
            });
		}
		else {
			return this.store.find('project', params.project_id);
		}
	},

	// Function the runs after we fully exit a project route and clears the map,
	// clears the serarch parameteres and items checked.
	tearDown: function(){
		// Clear the map.
	    this.set('mapObject.map', '');
		// Clear all search parameters.
		this.get('browseParams').clearAll();
		// Clear the chekes for the checked categories and tags.
		let categories = this.store.peekAll('category');
        // categories.setEach('checked', false);
        categories.forEach(function(category){
			category.setProperties({checked: false, allChecked: false, clicked: false});
            category.get('tag_ids').setEach('checked', false);
        });
		// Clear checked institution
		let institutions = this.store.peekAll('institution');
		institutions.setEach('checked', false);
		// Reset the year range.
		this.store.peekRecord('yearRange', 1).rollback();
	}.on('deactivate'), // This is the hook that makes the run when we exit the project route.

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

            Ember.run.scheduleOnce('afterRender', function() {
				//TODO Get rid of this `initProjectUI` bs.
                // _this.send('initProjectUI', _this.modelFor('project'));

				if(!_this.get('mapObject').map){

					// Create the Leaflet map.
					let map = _this.get('mapObject').createMap();

					// Add all the vector layers to the map.
					project.get('vector_layer_project_ids').then(function(vectors){
						vectors.forEach(function(vector){
							_this.get('mapObject').mapLayer(vector);
						});
					});

					// Add all the raster layers to the map.
					project.get('raster_layer_project_ids').then(function(rasters){
						rasters.forEach(function(raster){
							_this.get('mapObject').mapLayer(raster);
						});
					});

					// Pan and zoom the map for the project.
					map.panTo(new L.LatLng(project.get('center_lat'), project.get('center_lng')));
					map.setZoom(project.get('zoom_level'));

					// Add some base layers
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

					// Add the project's base map
					try {
						if (project.get('default_base_map') === 'satellite') {
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

					var controlDiv = control.onAdd(map);
					Ember.$('.base-layer-controls').append(controlDiv);
				}
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

			// Only call save if the session is authenticated.
			// There is another check on the server that verifies the user is
			// authenticated and is allowed to edit this project.
			if(this.get('session.isAuthenticated')){
	            newLayer.save().then(function(){
	                // Add the map to the view
	                _this.get('mapObject').mapLayer(newLayer);
	                // Show a success message.
	                // _this.controllerFor('project/browse-layers').set('editSuccess', true);
	                // Ember.run.later(this, function(){
	                //     _this.controllerFor('project/browse-layers').set('editSuccess', false);
	                // }, 3000);
	            }, function(){
	                // _this.controllerFor('project/browse-layers').set('editFail', true);
	                // Ember.run.later(this, function(){
	                //     _this.controllerFor('project/browse-layers').set('editFail', false);
	                // }, 3000);
	            });
			}
			else if (project.may_edit) {
				_this.get('mapObject').mapLayer(newLayer);
			}

        },

		// TODO This shouldn't call destroyRecord, it should call dealte and then
		// save if user is authenticated.
        removeLayer(layer, format) {
            const project = this.modelFor('project');
			let _this = this;
			// Build a hash for the query. We do this because one key will need
			// to equal the `format` var.
			let attrs = {};
			let layer_id = format+'_layer_id';
			attrs[layer_id] = layer.get('id');
			attrs['project_id'] = project.id;
			// Get the join between layer and project
            this.store.queryRecord(format+'-layer-project',
				attrs
            ).then(function(layerToRemove){
                // Remove the object from the DOM
                project.get(format+'_layer_project_ids').removeObject(layerToRemove);
                // Delete the record from the project
                layerToRemove.destroyRecord().then(function(){
                    // Set active to false
                    layer.set('active_in_project', false);
                    _this.controllerFor('project/browse-layers').set('editSuccess', true);
                    Ember.run.later(this, function(){
                        _this.controllerFor('project/browse-layers').set('editSuccess', false);
                        // Remove the layer from the map
                        Ember.$("."+layer.get('slug')).fadeOut( 500, function() {
                            Ember.$(this).remove();
                        });
                    }, 3000);
                }, function(){
                    // _this.controllerFor('project/browse-layers').set('editFail', true);
                    // Ember.run.later(this, function(){
                    //     _this.controllerFor('project/browse-layers').set('editFail', false);
                    // }, 3000);
                });
            });
        },


    },

});
