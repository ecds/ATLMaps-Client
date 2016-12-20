import Ember from 'ember';
import burgerMenu from 'ember-burger-menu';

const {
    RSVP,
    inject: {
        service
    },
    get,
    getWithDefault,
    set,
    Route,
    run
} = Ember;

export default Route.extend({

    mapObject: service(),
    dataColors: service(),
    browseParams: service(),
    session: service(),
    cookies: service(),
    flashMessage: service(),
    currentUser: service(),

    // This prevents redirection after authentication.
    beforeModel: function(transition) {
        if (!this.get('session.isAuthenticated')) {
          this.set('session.attemptedTransition', transition);
        }
    },

    model(params) {
        let project = '';
        if (params.project_id === 'explore') {
            project = this.store.createRecord('project', {
                id: '123456789',
                name: 'Explore',
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13,
                default_base_map: 'street',
                exploring: true,
                may_edit: true,
                description: 'Here you can explore almost 3,000 maps of Atlanta from collections held by Emory University and Georgia State University. Go ahead and click the search glass to the left and say good bye to next few hours.',
                explore: true
            });
            burgerMenu.set('open', true);
        } else {
            project = this.store.findRecord('project', params.project_id);
        }
        return RSVP.hash({
            project: project,
            yearRange: this.store.findRecord('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            rasters: this.store.query('raster-layer', { search: true }),
            vectors: this.store.query('vector-layer', { search: true })
        });
    },

    afterModel() {
        const project = this.modelFor('project').project;
        const projectID = get(project, 'id');
        if (get(this, 'cookies').read(`noIntro${projectID}`) === true) {
            project.setProperties({ suppressIntro: true });
        }
    },

    map() {
        return this.get('mapObject').createMap();
    },

    setUp: function() {
        const project = this.modelFor('project').project;
        const cookieService = get(this, 'cookies');
        const _this = this;

        run.scheduleOnce('afterRender', function() {
            if (!_this.get('mapObject').map) {
                // Create the Leaflet map.
                _this.map(project);
                _this.get('mapObject').setUpProjectMap(project);
            }

            const suppressCookie = cookieService.read(`noIntro${project.id}`);
            if (suppressCookie) {
                project.setProperties(
                    {
                        hasSuppressCookie: true,
                        suppressIntro: true
                    });
            } else {
                set(_this, 'hasSuppressCookie', false);
            }
        });
    }.on('activate'),

    // Function the runs after we fully exit a project route and clears the map,
    // clears the serarch parameteres and items checked. Fired by the `deactivate` hook.
    tearDown: function() {
        get(this, 'browseParams').init();
        // Clear the chekes for the checked categories and tags.
        const categories = this.store.peekAll('category');
        // categories.setEach('checked', false);
        categories.forEach(function(category) {
            category.setProperties({
                // checked: false,
                allChecked: false,
                clicked: false
            });
            // category.get('tag_ids').setEach('checked', false);
        });
        // Clear the vector layers that are marked active in this project.
        const vectors = this.store.peekAll('vector-layer');
        vectors.forEach(function(vector) {
            vector.setProperties({
                active_in_project: false
            });
        });
        // // Clear the raster layers that are marked active in this project.
        const rasters = this.store.peekAll('raster-layer');
        rasters.forEach(function(raster) {
            raster.setProperties({
                active_in_project: false
            });
        });
        set(this.controller, 'rasters', null);
        set(this.controller, 'vectors', null);        // Clear checked institution
        const institutions = this.store.peekAll('institution');
        institutions.setEach('checked', false);
        // // TODO Why doesn't this work?
        // // Reset the year range.
        // // this.store.peekRecord('yearRange', 1).rollback();
        // // TODO Can this be done via the vectorDetailContent service?
        // $('.vector-info').remove();
        // // Clear the map.
        get(this, 'mapObject.map').remove();
        set(this, 'mapObject.map', '');

        burgerMenu.set('open', false);
    }.on('deactivate'), // This is the hook that makes the run when we exit the project route.

    updatedResults(type) {
        set(this.controller, `${type}_diffResults`, true);
        run.later(this, function() {
            set(this.controller, `${type}_diffResults`, false);
        }, 300);
    },



    actions: {

        toggleIntro() {
            this.modelFor('project').project.toggleProperty('suppressIntro');
        },

        toggleEdit() {
            this.modelFor('project').project.toggleProperty('editing');
        },

        showSearch() {
            burgerMenu.toggleProperty('open');
            this.controller.toggleProperty('showingSearch');
        },

        updateProject(project, message) {
            const _this = this;
            run.later(this, function() {
                project.save().then(function() {
                    set(_this, 'flashMessage.message', message);
                    set(_this, 'flashMessage.success', true);
                    set(_this, 'flashMessage.show', true);
                    // _this.toggleProperty('flashMessage.showing');
                    run.later(this, function() {
                        set(_this, 'flashMessage.message', '');
                        set(_this, 'flashMessage.show', false);
                        set(_this, 'flashMessage.success', true);
                        // _this.toggleProperty('flashMessage.showing');
                    }, 3000)
                }, function() {
                    // TODO figure out how to give feedback on these shared actions
                    set(_this, 'flashMessage.message', 'Oh no! Someting went wrong <i class="material-icons">sentiment_dissatisfied</i>');
                    set(_this, 'flashMessage.show', true);
                    set(_this, 'flashMessage.success', false);

                    Ember.run.later(this, function(){
                        set(_this, 'flashMessage.message', '');
                        set(_this, 'flashMessage.show', false);
                    }, 3000);
                });
            }, 300);
            // this.modelFor('project').project.save();
        },

        addRemoveLayer(layer) {
            const project = this.modelFor('project').project;
            // This is pretty ugly. When called from the `search-list-results` components
            // `layer` is an instance of `raster-layer`, when called from the `project.raster-layer`
            // route, `layer` is an instance of `raster-layer-project`. Maybe we can clean this up
            // when we move to jsonapi?
            const layerModel = getWithDefault(layer, '_internalModel.modelName', `${format}_layer_project_ids).get('_internalModel.modelName')`);

            const layerObj = this.store.peekRecord(layerModel, layer.get('id'));
            const format = layerObj.get('data_format');
            const _this = this;

            // TODO Q: Do we set `active_in_project` before?
            if (layerObj.get('active_in_project') === false) {
                let newLayer = '';
                switch (format) {
                case 'raster': {
                    const position = project.get('raster_layer_project_ids.length') + 11;
                    newLayer = this.store.createRecord(`${format}-layer-project`, {
                        project_id: project.id,
                        raster_layer_id: layerObj,
                        data_format: layerObj.get('data_format'),
                        position // enhanced litrial
                    });
                    project.get('raster_layer_project_ids').pushObject(newLayer);
                    break;
                }

                case 'vector': {
                    let layerColor = '';
                    switch (layerObj.get('data_type')) {
                    case 'point-data': {
                        const markerColors = this.get('dataColors.markerColors');
                        layerColor = Math.floor(Math.random() * markerColors.length);
                        break;
                    }
                    default: {
                        const shapeColors = this.get('dataColors.shapeColors');
                        layerColor = Math.floor(Math.random() * Object.keys(shapeColors).length);
                        break;
                    }
                    }
                    newLayer = this.store.createRecord('vector-layer-project', {
                        project_id: project.id,
                        vector_layer_id: layerObj,
                        data_format: layerObj.get('data_format'),
                        marker: layerColor
                    });
                }
                // no default
                }
                project.get(`${format}_layer_project_ids`).addObject(newLayer);

                _this.get('mapObject').mapLayer(newLayer);
                // Only call save if the session is authenticated.
                // There is another check on the server that verifies the user is
                // authenticated and is allowed to edit this project.
                // TODO, abstract the save/don't save calls for add and remove.
                if (this.get('session.isAuthenticated') && (project.id != '123456789')) {
                    newLayer.save().then(function() {
                        // TODO Show a success message.
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
                const attrs = {};
                const layerId = `${format}_layer_id`;
                attrs[layerId] = layer.get('id');
                // NOTE: This might be wrong. Was `attrs['project_id'] =`
                attrs.project_id = project.id;
                // Get the join between layer and project
                // Remove the object from the map/DOM
                this.get('mapObject.projectLayers')[layer.get('slug')].remove();
                // $(`#${layer.get('name')}`).remove();
                // Delete the record from the project
                this.store.queryRecord(`${layerModel}-project`, attrs).then(function(layerToRemove) {
                    let layerIdToRemove = _this.store.peekRecord(`${layerModel}-project`, layerToRemove.id)
                    layerIdToRemove.deleteRecord();
                    layerToRemove.deleteRecord();//.then(function() {
                        project.get(`${format}_layer_project_ids`).removeObject(layerIdToRemove);
                        // Set active to false
                        layer.set('active_in_project', false);
                        // TODO figure out how to give feedback on these shared actions
                        // _this.controllerFor('project/browse-layers').set('editSuccess', true);
                        // Ember.run.later(this, function(){
                        //     _this.controllerFor('project/browse-layers')
                        //     .set('editSuccess', false);
                        if (_this.get('session.isAuthenticated') && project.id != '123456789') {
                            layerToRemove.save();
                        }
                        // Ember.$("."+layer.get('slug')).fadeOut( 500, function() {
                        //     Ember.$(this).remove();
                        // });
                        // }, 3000);
                    //}, function() {
                        // TODO figure out how to give feedback on these shared actions
                        // _this.controllerFor('project/browse-layers').set('editFail', true);
                        // Ember.run.later(this, function(){
                        //     _this.controllerFor('project/browse-layers').set('editFail', false);
                        // }, 3000);
                    // });
                });
            }

            set(_this.controller, `${format}-updated`, true)
            run.later(this, function() {
                set(_this.controller, `${format}-updated`, false)
            }, 3000);

            // return false;
        },

        nextPage(meta) {
            this.getResults(meta.next_page);
        },

        // Action to make the query to the API and render the results to the
        // `project/browse-layers` route.
        getResults(page) {
            const _this = this;
            let currentRasters = get(this.controller, 'rasters.content.meta.total_count');
            let currentVectors = get(this.controller, 'vectors.content.meta.total_count');
            burgerMenu.set('open', true);
            // this.modelFor('project').project.setProperties({ showing_browse_results: true });
            let searchParams = {
                search: true,
                tags: this.get('browseParams.tags'),
                text_search: this.get('browseParams.searchText'),
                institution: this.get('browseParams.institutions'),
                start_year: this.get('browseParams.start_year'),
                end_year: this.get('browseParams.end_year'),
                bounds: this.get('browseParams.bounds'),
                meta: this.get('controller.rasters.meta'),
                page: page || 0,
                limit: get(this, 'browseParams.searchLimit')
            };
            for (let param in searchParams) {
                if (searchParams[param] === null ||
                    searchParams[param] === undefined ||
                    searchParams[param].length === 0)
                {
                  delete searchParams[param];
                }
            }
            if (Object.keys(searchParams['bounds']).length === 0) {
                delete searchParams['bounds'];
            }
            if (Object.keys(searchParams).length > 3) {
                set(this.controller, 'rasters', this.store.query('raster-layer', searchParams)).then(function(rasters) {
                    if (currentRasters != rasters.meta.total_count) {
                        _this.updatedResults('rasters');
                    }
                });

                set(this.controller, 'vectors', this.store.query('vector-layer', searchParams)).then(function(vectors) {
                    if (currentVectors != vectors.meta.total_count) {
                        _this.updatedResults('vectors');
                    }
                });

                this.setProperties({
                    searched: true,
                    showingResults: true
                });
            } else {
                set(this.controller, 'rasters', null);
                set(this.controller, 'vectors', null);
            }
        },

        setColor(layer) {
            layer.save().then(
                // this.get('flashMessage').showMessage('New color saved!', 'success')
            ).catch(
                // this.get('flashMessage').showMessage('Dang, something went wrong!', 'fail')
            );
        }

    }

});
