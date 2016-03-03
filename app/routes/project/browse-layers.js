import Ember from 'ember';

export default Ember.Route.extend({
    classNames: ['bwowse-layers-route'],

    browseParams: Ember.inject.service('browse-params'),
    mapObject: Ember.inject.service('map-object'),

    // This is a neat way to add multiple models to a route.
    model(){
        return Ember.RSVP.hash({
            yearRange: this.store.find('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            searchResults: this.store.findAll('search'),
            project: this.modelFor('project')
        });
    },

    setupController(controller, models){
        controller.set('yearRange', models.yearRange);
        controller.set('categories', models.categories);
        controller.set('institutions', models.institutions);
        controller.set('rastersActive', true);
        controller.set('editSuccess', false);
        controller.set('editFail', false);
    },

    actions: {

        // Action to make the query to the API and render the results to the
        // `project/browse-layers` route.
        getResults(){
            console.log(this.get('browseParams.start_year'));

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

        showResults(show){
            console.log(show);
            if (show === 'vector') {
                this.controllerFor('project/browse-layers').set('rastersActive', false);
                // this.setProperties({rastersActive: false});
            }
            else if (show === 'raster') {
                this.controllerFor('project/browse-layers').set('rastersActive', true);
            }
        }
    }
});
