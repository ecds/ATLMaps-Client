import Ember from 'ember';

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
    beforeModel(transition) {
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
        } else {
            project = this.store.findRecord('project', params.project_id);
        }
        return RSVP.hash({
            project,
            yearRange: this.store.findRecord('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            rasters: this.store.query('raster-layer', { search: true }),
            vectors: this.store.query('vector-layer', { search: true })
        });
    },

    afterModel() {
        const { project } = this.modelFor('project');
        const projectID = get(project, 'id');
        if (get(this, 'cookies').read(`noIntro${projectID}`) === true) {
            project.setProperties({ suppressIntro: true });
        }
        if (project.may_edit) {
            project.setProperties({ suppressIntro: true });
        }
    },

    map() {
        return this.get('mapObject').createMap();
    },

    setUp: function setUp() {
        const { project } = this.modelFor('project');
        const cookieService = get(this, 'cookies');
        const self = this;

        run.scheduleOnce('afterRender', () => {
            if (!self.get('mapObject').map) {
                // Create the Leaflet map.
                self.map(project);
                self.get('mapObject').setUpProjectMap(project);
            }

            const suppressCookie = cookieService.read(`noIntro${project.id}`);
            if (suppressCookie) {
                project.setProperties(
                    {
                        hasSuppressCookie: true,
                        suppressIntro: true
                    });
            } else {
                set(self, 'hasSuppressCookie', false);
            }
        });
    }.on('activate'),

    // Function the runs after we fully exit a project route and clears the map,
    // clears the serarch parameteres and items checked. Fired by the `deactivate` hook.
    tearDown: function tearDown() {
        this.currentModel.project.rolledBack();
        get(this, 'browseParams').init();
        // Clear the chekes for the checked categories and tags.
        const categories = this.store.peekAll('category');
        // categories.setEach('checked', false);
        categories.forEach((category) => {
            category.setProperties({
                // checked: false,
                allChecked: false,
                clicked: false
            });
            // category.get('tag_ids').setEach('checked', false);
        });
        // Clear the vector layers that are marked active in this project.
        const vectors = this.store.peekAll('vector-layer');
        vectors.forEach((vector) => {
            vector.setProperties({
                active_in_project: false
            });
        });
        // // Clear the raster layers that are marked active in this project.
        const rasters = this.store.peekAll('raster-layer');
        rasters.forEach((raster) => {
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

        // // Clear the map.
        get(this, 'mapObject.map').remove();
        set(this, 'mapObject.map', '');
    }.on('deactivate'), // This is the hook that makes the run when we exit the project route.

    updatedResults(type) {
        set(this.controller, `${type}_diffResults`, true);
        run.later(this, () => {
            set(this.controller, `${type}_diffResults`, false);
        }, 300);
    },

    actions: {

        toggleIntro() {
            this.modelFor('project').project.toggleProperty('suppressIntro');
        },

        // showSearch() {
        //     this.controller.toggleProperty('showingSearch');
        // },

        updateProject(project, message, action) {
            if (action === 'publish') {
                project.toggleProperty('published');
            }
            const self = this;
            run.later(this, () => {
                project.save().then(() => {
                    set(self, 'flashMessage.message', message);
                    set(self, 'flashMessage.success', true);
                    set(self, 'flashMessage.show', true);
                    // self.toggleProperty('flashMessage.showing');
                    run.later(this, () => {
                        set(self, 'flashMessage.message', '');
                        set(self, 'flashMessage.show', false);
                        set(self, 'flashMessage.success', true);
                        // self.toggleProperty('flashMessage.showing');
                    }, 3000);
                }, () => {
                    // TODO figure out how to give feedback on these shared actions
                    set(self, 'flashMessage.message', 'Oh no! Someting went wrong <i class="material-icons">sentiment_dissatisfied</i>');
                    set(self, 'flashMessage.show', true);
                    set(self, 'flashMessage.success', false);

                    run.later(this, () => {
                        set(self, 'flashMessage.message', '');
                        set(self, 'flashMessage.show', false);
                    }, 3000);
                });
            }, 300);
            // this.modelFor('project').project.save();
        },

        addRemoveLayer(layer) {
            const { project } = this.modelFor('project');
            // This is pretty ugly. When called from the `search-list-results` components
            // `layer` is an instance of `raster-layer`, when called from the `project.raster-layer`
            // route, `layer` is an instance of `raster-layer-project`. Maybe we can clean this up
            // when we move to jsonapi?
            const layerModel = getWithDefault(layer, '_internalModel.modelName');
            const layerObj = this.store.peekRecord(layerModel, layer.get('id'));
            const format = layerObj.get('data_format');
            const self = this;

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
                    project.get('raster_layer_ids').pushObject(layerObj);
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

                self.get('mapObject').mapLayer(newLayer);
                // Only call save if the session is authenticated.
                // There is another check on the server that verifies the user is
                // authenticated and is allowed to edit this project.
                // TODO, abstract the save/don't save calls for add and remove.
                if (this.get('session.isAuthenticated') && (project.id !== '123456789')) {
                    newLayer.save().then(() => {
                        // TODO Show a success message.
                    }, () => {
                        // TODO figure out how to give feedback on these shared actions
                        // self.controllerFor('project/browse-layers').set('editFail', true);
                        // Ember.run.later(this, function(){
                        //     self.controllerFor('project/browse-layers').set('editFail', false);
                        // }, 3000);
                    });
                }

            // REMOVE LAYER
            } else {
                // Build a hash for the query. We do this because one key will need
                // to equal the `format` var.
                const attrs = {};
                const layerId = `${format}_layer_id`;
                attrs[layerId] = layer.get('id');
                // NOTE: This might be wrong. Was `attrs['project_id'] =`
                attrs.project_id = project.id;
                // Get the join between layer and project
                // Remove the object from the map/DOM
                // TODO: better way to organize the projectLayers?
                this.get('mapObject.projectLayers')[`${format}s`][layer.get('slug')].remove();
                get(project, `${format}_layer_project_ids`).forEach((layerToRemove) => {
                    if (layer.get('id') === get(layerToRemove, `${format}_layer_id.content.id`)) {
                        layerToRemove.deleteRecord();
                        layer.set('active_in_project', false);
                        if (self.get('session.isAuthenticated') && project.id !== '123456789') {
                            layerToRemove.save();
                        }
                    }
                });
            }

            set(self.controller, `${format}-updated`, true);
            run.later(this, () => {
                set(self.controller, `${format}-updated`, false);
            }, 3000);

            // return false;
        },

        nextPage(meta) {
            this.getResults(meta.next_page);
        },

        // Action to make the query to the API and render the results to the
        // `project/browse-layers` route.
        getResults(page) {
            const self = this;
            const currentRasters = get(this.controller, 'rasters.content.meta.total_count');
            const currentVectors = get(this.controller, 'vectors.content.meta.total_count');
            const searchParams = {
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
            for (const param in searchParams) {
                if (searchParams[param] === null
                    || searchParams[param] === undefined
                    || searchParams[param].length === 0) {
                    delete searchParams[param];
                }
            }
            if (Object.keys(searchParams.bounds).length === 0) {
                delete searchParams.bounds;
            }
            if (Object.keys(searchParams).length > 3) {
                set(this.controller, 'rasters', this.store.query('raster-layer', searchParams)).then((rasters) => {
                    if (currentRasters !== rasters.meta.total_count) {
                        self.updatedResults('rasters');
                    }
                });

                set(this.controller, 'vectors', this.store.query('vector-layer', searchParams)).then((vectors) => {
                    if (currentVectors !== vectors.meta.total_count) {
                        self.updatedResults('vectors');
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
