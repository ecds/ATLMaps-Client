import Ember from 'ember';
import { EKMixin, keyDown } from 'ember-keyboard';

const {
    RSVP,
    inject: {
        service
    },
    get,
    getWithDefault,
    on,
    set,
    Route,
    run
} = Ember;

export default Route.extend(EKMixin, {

    mapObject: service(),
    dataColors: service(),
    browseParams: service(),
    session: service(),
    cookies: service(),
    flashMessage: service(),
    currentUser: service(),

    // This prevents redirection after authentication.
    // beforeModel(transition) {
    //     if (!this.get('session.isAuthenticated')) {
    //         this.set('session.attemptedTransition', transition);
    //     }
    // },

    model(params) {
        let project = null;
        // let defaults = {
        //     published: false,
        //     center_lat: 33.75440100,
        //     center_lng: -84.3898100,
        //     zoom_level: 13,
        //     default_base_map: 'street',
        //     suppressIntro: true,
        //     showingSearch: true,
        //     hasSuppressCookie: true
        // };

        if (params.project_id === 'explore') {
            project = this.store.createRecord('project',
                {
                    published: false,
                    center_lat: 33.75440100,
                    center_lng: -84.3898100,
                    zoom_level: 13,
                    default_base_map: 'street',
                    suppressIntro: true,
                    showingSearch: true,
                    hasSuppressCookie: true,
                    name: 'Explore',
                    description: 'Here you can explore almost 3,000 maps of Atlanta from collections held by Emory University and Georgia State University. Go ahead and click the search glass to the left and say good bye to next few hours.',
                    exploring: true,
                    is_mine: true
                }
            );
        } else if (params.project_id === 'new') {
            // defaults = null;
            project = this.store.createRecord('project',
                {
                    published: false,
                    center_lat: 33.75440100,
                    center_lng: -84.3898100,
                    zoom_level: 13,
                    default_base_map: 'street',
                    suppressIntro: true,
                    showingSearch: true,
                    hasSuppressCookie: true,
                    name: `New: ${new Date()}`,
                    description: 'ATLMaps is very much a work in progress. We will be updating the insturctions soon. For now, play with the filters to the right, add some layers, and have fun.',
                    is_mine: true,
                    may_edit: true
                }
            );
        } else {
            project = this.store.findRecord('project', params.project_id);
        }
        return RSVP.hash({
            project,
            // yearRange: this.store.findRecord('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            rasters: this.store.query('raster-layer', { search: true }),
            vectors: this.store.query('vector-layer', { search: true })
        });
    },

    afterModel(model) {
        this.get('meta').update({
            title: `${get(model.project, 'name')}: ATLMaps`,
            description: get(model.project, 'description')
            // 'og:image': 'https://exemple.net/latest-news.png',
            // 'twitter:author': '@j15e'
        });
        get(this, 'currentUser').load();
    },

    map() {
        return this.get('mapObject').createMap();
    },

    setUp: function setUp() {
        const { project } = this.modelFor('project');
        const cookieService = get(this, 'cookies');
        get(this, 'dataColors');
        set(this, 'keyboardActivated', true);
        // Unlikely, but just incase an error message is hanging around.
        get(this, 'flashMessage').clearMessage();

        run.scheduleOnce('afterRender', () => {
            if (!this.get('mapObject').map) {
                // Create the Leaflet map.
                this.map(project);
                this.get('mapObject').setUpProjectMap(project);
            }

            const suppressCookie = cookieService.read(`noIntro${project.id}`);
            if (suppressCookie) {
                project.setProperties(
                    {
                        hasSuppressCookie: true,
                        suppressIntro: true
                    });
            } else {
                set(this, 'hasSuppressCookie', false);
            }
        });
    }.on('activate'),

    // Function the runs after we fully exit a project route and clears the map,
    // clears the serarch parameteres and items checked. Fired by the `deactivate` hook.
    tearDown: function tearDown() {
        let { project } = this.currentModel;
        project.rollbackAttributes();
        get(this, 'browseParams').init();
        // // Clear the chekes for the checked categories and tags.
        this.store.peekAll('tag').setEach('checked', false);
        let categories = this.store.peekAll('category');
        categories.forEach((category) => {
            category.setProperties({
                checked: false,
                allChecked: false,
                clicked: false
            });
            // category.get('tag_ids').setEach('checked', false);
        });
        // Clear the vector layers that are marked active in this project.
        let vectors = this.store.peekAll('vector-layer');
        vectors.forEach((vector) => {
            vector.setProperties({
                active_in_project: false
            });
        });
        // Clear the raster layers that are marked active in this project.
        let rasters = this.store.peekAll('raster-layer');
        rasters.forEach((raster) => {
            raster.setProperties({
                active_in_project: false
            });
        });

        set(this.controller, 'rasters', null);
        set(this.controller, 'vectors', null);
        // Clear checked institution
        let institutions = this.store.peekAll('institution');
        institutions.setEach('checked', false);

        // // Clear the map.
        get(this, 'mapObject.map').remove();
        set(this, 'mapObject.map', '');
        // Uload the store. It would be nice to just unload all at once, but we
        // need to keep the user in the store.
        // NOTE: This creates an awful memroy leak with dev tools open.
        this.store.unloadAll('raster-layer');
        this.store.unloadAll('raster-layer-project');
        this.store.unloadAll('vector-layer');
        this.store.unloadAll('vector-layer-project');
        this.store.unloadAll('vector-feature');
        this.store.unloadAll('project');
        project = null;
        categories = null;
        vectors = null;
        rasters = null;
        institutions = null;
    }.on('deactivate'), // This is the hook that makes the run when we exit the project route.

    updatedResults(type) {
        set(this.controller, `${type}_diffResults`, true);
        run.later(this, () => {
            set(this.controller, `${type}_diffResults`, false);
        }, 300);
    },

    closeIntroOnEscape: on(keyDown('Escape'), function close() {
        set(this, 'currentModel.project.suppressIntro', true);
    }),

    actions: {

        toggleIntro() {
            this.modelFor('project').project.toggleProperty('suppressIntro');
        },

        saveProject(project) {
            const flash = get(this, 'flashMessage');
            project.save().then((savedProject) => {
                savedProject.get('raster_layer_project').invoke('save');
                savedProject.get('vector_layer_project').invoke('save');
                flash.savedMessage('PROJECT SAVED');
            }, (error) => {
                flash.failedMessage(`ERROR UPDATING PROJECT: ${error.message}`);
            });
        },

        updateProject(project, message, action) {
            const flash = get(this, 'flashMessage');
            if (action === 'publish') {
                project.toggleProperty('published');
            }
            run.later(this, () => {
                project.save().then((savedProject) => {
                    savedProject.get('raster_layer_project').invoke('save');
                    savedProject.get('vector_layer_project').invoke('save');
                    flash.savedMessage('PROJECT UPDATED');
                }, (error) => {
                    flash.failedMessage(`ERROR UPDATING PROJECT: ${error.message}`);
                });
            }, 300);
        },

        cancleUpdate(project) {
            project.rollbackAttributes();
            set(project, 'suppressIntro', true);
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
            const flash = get(this, 'flashMessage');
            // `active_in_project` is set in the mapObject service when it is added from the map.
            if (layerObj.get('active_in_project') === false) {
                let newLayer = '';

                switch (format) {
                case 'raster': {
                    // Set the position on the join table. This is used to set
                    // the zIndex of the layer.
                    const position = project.get('raster_layer_project.length') + 11;

                    newLayer = this.store.createRecord('raster_layer_project', {
                        project,
                        raster_layer: layerObj,
                        data_format: layerObj.get('data_format'),
                        position // enhanced litrial
                    });
                    // Pushes the object into the model show it will appear
                    // in the list.
                    // project.get('raster_layer_project').pushObject(newLayer);
                    break;
                }

                case 'vector': {
                    let layerColor = '';
                    switch (layerObj.get('data_type')) {
                    case 'Point': {
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
                        project,
                        vector_layer: layerObj,
                        data_format: layerObj.get('data_format'),
                        marker: layerColor,
                        data_type: layerObj.get('data_type')
                    });
                }
                // no default
                }
                project.get(`${format}_layer_project`).pushObject(newLayer);

                this.get('mapObject').mapLayer(newLayer);
                // Only call save if the session is authenticated.
                // There is another check on the server that verifies the user is
                // authenticated and is allowed to edit this project.
                // TODO, abstract the save/don't save calls for add and remove.
                if (this.get('session.isAuthenticated') && (get(project, 'id'))) {
                    newLayer.save().then(() => {
                        flash.setProperties({
                            message: 'LAYER ADDED',
                            show: true,
                            success: true
                        });
                        run.later(this, () => {
                            flash.setProperties({ message: '', show: false });
                        }, 3000);
                    }, () => {
                        flash.setProperties({
                            message: 'ERROR LAYER NOT ADDED',
                            show: true,
                            success: false
                        });
                        run.later(this, () => {
                            flash.setProperties({ message: '', show: false });
                        }, 3000);
                        project.rollbackAttributes();
                        layerObj.rollbackAttributes();
                    });
                }

            // REMOVE LAYER
            } else {
                layerObj.setProperties({ active_in_project: false });
                // Build a hash for the query. We do this because one key will need
                // to equal the `format` var.
                const attrs = {};
                const layerId = `${format}_layer`;
                attrs[layerId] = layer.get('id');
                attrs.project_id = project.id;
                // Get the join between layer and project
                // Remove the object from the map/DOM
                // TODO: better way to organize the projectLayers?
                // FIXME: Remove project layer without loop.
                get(layer, 'leaflet_object').remove();
                get(project, `${format}_layer_project`).forEach((layerToRemove) => {
                    if (layer.get('id') === get(layerToRemove, `${format}_layer.id`)) {
                        layerToRemove.deleteRecord();
                        if (this.get('session.isAuthenticated') && project.id !== '123456789') {
                            layerToRemove.save();
                        }
                    }
                });
            }

            set(this.controller, `${format}-updated`, true);
            run.later(this, () => {
                set(this.controller, `${format}-updated`, false);
            }, 3000);

            // return false;
        },

        nextPage(meta, type) {
            this.getResults(meta.next_page, type);
        },

        // Action to make the query to the API and render the results to the
        // `project/browse-layers` route.
        getResults(page, type) {
            // This scrolls the results to the top while clicking through the pages.
             // TODO: Will need to fix this for fastboot.
            document.getElementById(type).childNodes[0].scrollTop = 0;
            const data = this.modelFor('project');
            const currentRasters = get(data, 'rasters.meta.total_count');
            const currentVectors = get(data, 'vectors.meta.total_count');
            const searchParams = {
                search: true,
                tags: this.get('browseParams.tags'),
                text_search: this.get('browseParams.searchText'),
                institution: this.get('browseParams.institutions'),
                // start_year: this.get('browseParams.start_year'),
                // end_year: this.get('browseParams.end_year'),
                bounds: this.get('browseParams.bounds'),
                meta: this.get('controller.rasters.meta'),
                page: page || 0,
                limit: get(this, 'browseParams.searchLimit')
            };

            if (type === 'rasters' || !type) {
                set(this.controller, 'searchingRasters', true);
                this.store.query('raster-layer', searchParams).then((rasters) => {
                    set(data, 'rasters', rasters);
                    if (currentRasters !== rasters.meta.total_count) {
                        this.updatedResults('rasters');
                    }
                    set(this.controller, 'searchingRasters', false);
                });
            }

            if (type === 'vectors' || !type) {
                set(this.controller, 'searchingVectors', true);
                this.store.query('vector-layer', searchParams).then((vectors) => {
                    set(data, 'vectors', vectors);
                    if (currentVectors !== vectors.meta.total_count) {
                        this.updatedResults('vectors');
                    }
                    set(this.controller, 'searchingVectors', false);
                });
            }
        }

    }

});
