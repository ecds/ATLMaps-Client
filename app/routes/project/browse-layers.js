import Ember from 'ember';

export default Ember.Route.extend({
    classNames: ['bwowse-layers-route'],

    browseParams: Ember.inject.service('browse-params'),
    mapObject: Ember.inject.service('map-object'),

    beforeModel() {
        // console.log(this);
    },

    // This is a neat way to add multiple models to a route.
    model() {
        return Ember.RSVP.hash({
            yearRange: this.store.findRecord('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            project: this.modelFor('project'),
        });
    },

    setupController(controller, models) {
        controller.set('yearRange', models.yearRange);
        controller.set('categories', models.categories);
        controller.set('institutions', models.institutions);
        controller.set('project', models.project);
        // controller.set('editSuccess', false);
        // controller.set('editFail', false);
        // controller.set('showingResults', true);
    },

    actions: {

        didTransition() {
            // Show the results pane when we enter the the route.
            this.send('getResults');
            return true;
        },

        toggleResults(project) {
            project.toggleProperty('showing_browse_results');
        },
        // Action to make the query to the API and render the results to the
        // `project/browse-layers` route.
        getResults() {
            this.setProperties({
                searched: true,
                // showingResults: true
            });
            return this.render('components/browse-results', {
                outlet: 'browse-results',
                into: 'project', // Want it to open in the project view
                controller: 'project/browse-layers', // don't set controller to `project` or it will screw up `model`
                model: this.store.queryRecord('search', {
                    tags: this.get('browseParams.tags'),
                    text_search: this.get('browseParams.searchText'),
                    name: this.get('browseParams.institutions'),
                    start_year: this.get('browseParams.start_year'),
                    end_year: this.get('browseParams.end_year')
                })
            });
        },

        // NOTE: this is no longer needed?
        // showResults(show){
        //     // TODO: We need to do a better job showing ruesults. In reality,
        //     // most searches will start with more raster layers due to volume.
        //     if (show === 'vector') {
        //         this.controllerFor('project/browse-layers').set('rastersActive', false);
        //     }
        //     else if (show === 'raster') {
        //         this.controllerFor('project/browse-layers').set('rastersActive', true);
        //     }
        // }
    }
});
