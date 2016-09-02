import Ember from 'ember';

const {
    $,
    inject: {
        service
    },
    set,
    Route,
    run
} = Ember;

export default Route.extend({

    // mapObject: Ember.inject.service('map-object'),
    mapObject: service(),
    dataColors: service(),
    browseParams: service(),
    session: service(),
    flashMessage: service(),
    showIntro: service(),

    model(params) {
        if (params.project_id === 'explore') {
            return this.store.createRecord('project', {
                name: 'Explore',
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13,
                default_base_map: 'street',
                exploring: true,
                may_browse: true,
                description: 'Here we say something about how they can play around but nothing will be saved.'
            });
        } else {
            return this.store.findRecord('project', params.project_id);
        }
    },

    afterModel() {
        this.get('showIntro').init(this.modelFor('project').get('id'));
    },

    map() {
        return this.get('mapObject').createMap();
    },

    // Function the runs after we fully exit a project route and clears the map,
    // clears the serarch parameteres and items checked. Fired by the `deactivate` hook.
    tearDown: function() {
        this.get('browseParams').init();
        // Clear the chekes for the checked categories and tags.
        let categories = this.store.peekAll('category');
        // categories.setEach('checked', false);
        categories.forEach(function(category) {
            category.setProperties({
                checked: false,
                allChecked: false,
                clicked: false
            });
            category.get('tag_ids').setEach('checked', false);
        });
        // Clear the vector layers that are marked active in this project.
        let vectors = this.store.peekAll('vector-layer');
        vectors.forEach(function(vector) {
            vector.setProperties({
                active_in_project: false
            });
        });
        // Clear the raster layers that are marked active in this project.
        let rasters = this.store.peekAll('raster-layer');
        rasters.forEach(function(raster) {
            raster.setProperties({
                active_in_project: false
            });
        });
        // Clear checked institution
        let institutions = this.store.peekAll('institution');
        institutions.setEach('checked', false);
        // Reset the year range.
        // this.store.peekRecord('yearRange', 1).rollback();
        $('.vector-info').remove();
        // Clear the map.
        this.get('mapObject.map').remove();
        this.set('mapObject.map', '');
    }.on('deactivate'), // This is the hook that makes the run when we exit the project route.

    actions: {

        toggleIntro() {
            this.get('showIntro').toggleShow();
        },

        toggleEdit() {
            this.modelFor('project').toggleProperty('editing');
            this.modelFor('project').toggleProperty('may_browse');
        },

        willTransition(transition) {
            // TODO: WTF does this do?
            if (transition.targetName === 'project.browse-layers') {
                this.controllerFor('project').set('showBrowse', true);
            } else {
                this.controllerFor('project').set('showBrowse', false);
            }
            // TODO: Kill the vector info window here.
            // TODO: User test if the vector window should go away.

            return true;
        },

        didTransition() {

            let project = this.modelFor('project');

            let _this = this;

            run.scheduleOnce('afterRender', function() {

                if (!_this.get('mapObject').map) {

                    // Create the Leaflet map.
                    _this.map(project);
                    _this.get('mapObject').setUpProjectMap(project);

                }
            });
        },

        // TODO this should be a Component or service
        showLayerInfoDetals(layer) {

            try {
                // Toggle the totally made up property!
                // The `!` in the second argument toggles the true/false state.
                this.set('clickedLayer.clicked', !this.get('clickedLayer.clicked'));
            } catch (err) {
                // The first time, clickedCategory will not be an instance
                // of `category`. It will just be `undefined`.
            }
            // So if the category that is clicked does not match the one in the
            // `clickedCategory` property, we set the `clicked` attribute to `true`
            // and that will remove the `hidden` class in the template.
            if (layer !== this.get('clickedLayer')) {
                // Update the `clickedCategory` property
                this.set('clickedLayer', layer);
                // Set the model attribute
                layer.set('clicked', 'true');
            }
            // Otherwise, this must be the first time a user has clicked a category.
            else {
                set(this, 'clickedLayer', true);
            }
        },

        addRemoveLayer(layer) {
            let project = this.modelFor('project');

            let layerModel = layer._internalModel.modelName;

            let layerObj = this.store.peekRecord(layerModel, layer.get('id'));

            let format = layerObj.get('data_format');

            let _this = this;

            // TODO Q: Do we set `active_in_project` before?
            if (layerObj.get('active_in_project')) {

                let newLayer = '';
                switch (format) {
                    case 'raster':
                        let position = project.get('raster_layer_project_ids').get('length') + 11;

                        newLayer = this.store.createRecord(`${format}-layer-project`, {
                            project_id: project.id,
                            raster_layer_id: layerObj,
                            data_format: layerObj.get('data_format'),
                            position // enhanced litrial
                        });
                        break;

                    case 'vector':
                        let layerColor = '';
                        switch (layerObj.get('data_type')) {
                            case 'point-data':
                                let markerColors = this.get('dataColors.markerColors');
                                layerColor = Math.floor(Math.random() * markerColors.length);
                                break;
                            case 'polygon':
                            case 'line-data':
                                let shapeColors = this.get('dataColors.shapeColors');
                                layerColor = Math.floor(Math.random() * Object.keys(shapeColors).length);
                        }

                        newLayer = this.store.createRecord('vector-layer-project', {
                            project_id: project.id,
                            vector_layer_id: layerObj,
                            data_format: layerObj.get('data_format'),
                            marker: layerColor
                        });
                        break;
                }

                project.get(`${format}_layer_project_ids`).addObject(newLayer);

                _this.get('mapObject').mapLayer(newLayer);
                // Only call save if the session is authenticated.
                // There is another check on the server that verifies the user is
                // authenticated and is allowed to edit this project.
                if (this.get('session.isAuthenticated')) {
                    newLayer.save().then(function() {
                        // Add the map to the view
                        _this.get('mapObject').mapLayer(newLayer);
                        // TODO figure out how to give feedback on these shared actions
                        // Show a success message.
                        // _this.controllerFor('project/browse-layers').set('editSuccess', true);
                        // Ember.$('.browse-results').fadeTo(0.2);
                        run.later(this, function() {
                            // Ember.$('.browse-results').faddeTo(1);
                        }, 3000);
                    }, function() {
                        // TODO figure out how to give feedback on these shared actions
                        // _this.controllerFor('project/browse-layers').set('editFail', true);
                        // Ember.run.later(this, function(){
                        //     _this.controllerFor('project/browse-layers').set('editFail', false);
                        // }, 3000);
                    });
                }

                // REMOVE LAYER
            } else {
                // TODO This shouldn't call destroyRecord, it should call dealte and then
                // save if user is authenticated.

                // Build a hash for the query. We do this because one key will need
                // to equal the `format` var.
                let attrs = {};
                let layer_id = `${layerModel}_layer_id`;
                attrs[layer_id] = layer.get('id');
                // NOTE: This might be wrong. Was `attrs['project_id'] =`
                attrs.project_id = project.id;
                // Get the join between layer and project
                // NOTE: peekRecord doesn't work here? It is 4:17am
                this.store.queryRecord(`${layerModel}-project`,
                    attrs
                ).then(function(layerToRemove) {
                    // Remove the object from the DOM
                    project.get(`${format}_layer_project_ids`).removeObject(layerToRemove);
                    // Delete the record from the project
                    layerToRemove.deleteRecord().then(function() {
                        // Set active to false
                        layer.set('active_in_project', false);
                        // TODO figure out how to give feedback on these shared actions
                        // _this.controllerFor('project/browse-layers').set('editSuccess', true);
                        // Ember.run.later(this, function(){
                        //     _this.controllerFor('project/browse-layers').set('editSuccess', false);
                        //     // Remove the layer from the map

                        _this.get('projectLayers')[layer.get('slug')].remove();
                        if (this.get('session.isAuthenticated')) {
                            layerToRemove.save();
                        }
                        // Ember.$("."+layer.get('slug')).fadeOut( 500, function() {
                        //     Ember.$(this).remove();
                        // });
                        // }, 3000);
                    }, function() {
                        // TODO figure out how to give feedback on these shared actions
                        // _this.controllerFor('project/browse-layers').set('editFail', true);
                        // Ember.run.later(this, function(){
                        //     _this.controllerFor('project/browse-layers').set('editFail', false);
                        // }, 3000);
                    });
                });
            }
        },

        setColor(layer) {
            layer.save().then(
                this.get('flashMessage').showMessage('New color saved!', 'success')
            ).catch(
                // this.get('flashMessage').showMessage('Dang, something went wrong!', 'fail')
            );

        }

    }

});
