import Ember from 'ember';
import burgerMenu from 'ember-burger-menu';

const {
    $,
    Route,
    get,
    inject: {
        service
    },
    RSVP,
    set
} = Ember;

export default Route.extend({
    classNames: ['bwowse-layers-route'],

    browseParams: service('browse-params'),
    mapObject: service('map-object'),

    // This is a neat way to add multiple models to a route.
    model() {
        return RSVP.hash({
            yearRange: this.store.findRecord('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            project: this.modelFor('project'),
            rasters: this.store.query('raster-layer', { search: true }),
            vectors: this.store.query('vector-layer', { search: true })
        });
    },

    setupController(controller, models) {
        controller.set('yearRange', models.yearRange);
        controller.set('categories', models.categories);
        controller.set('institutions', models.institutions);
        controller.set('project', models.project);
        controller.set('rasters', models.rasters);
        controller.set('vectors', models.vectors);
    },

    actions: {

        didTransition() {
            // Show the results pane when we enter the the route.
            // this.send('getResults');
            return true;
        },

        toggleResults() {
            // let project = this.model;
            // project.toggleProperty('showing_browse_results');
        },

        nextPage(meta) {
            this.getResults(meta.next_page);
        },

        // Action to make the query to the API and render the results to the
        // `project/browse-layers` route.
        getResults(page) {
            burgerMenu.set('open', true);
            this.modelFor('project').setProperties({ showing_browse_results: true });
            set(this.controller, 'rasters', this.store.query('raster-layer', {
                    search: true,
                    tags: this.get('browseParams.tags'),
                    text_search: this.get('browseParams.searchText'),
                    institution: this.get('browseParams.institutions'),
                    start_year: this.get('browseParams.start_year'),
                    end_year: this.get('browseParams.end_year'),
                    bounds: this.get('browseParams.bounds'),
                    page: page || 0,
                    limit: get(this, 'browseParams.searchLimit')
                })
            );
            set(this.controller, 'vectors', this.store.query('vector-layer', {
                    search: true,
                    tags: this.get('browseParams.tags'),
                    text_search: this.get('browseParams.searchText'),
                    institution: this.get('browseParams.institutions'),
                    start_year: this.get('browseParams.start_year'),
                    end_year: this.get('browseParams.end_year')
                })
            );
            this.setProperties({
                searched: true,
                showingResults: true
            });
            $('#toggleResultsCheck').attr('checked', true);
        }
    }
});
