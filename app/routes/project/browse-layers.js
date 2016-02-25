import Ember from 'ember';

export default Ember.Route.extend({
    classNames: ['bwowse-layers-route'],

    browseParams: Ember.inject.service('browse-params'),

    model(){
        return Ember.RSVP.hash({
            yearRange: this.store.find('yearRange', 1),
            categories: this.store.findAll('category'),
            institutions: this.store.findAll('institution'),
            searchResults: this.store.findAll('search')
        });
    },

    setupController(controller, models){
        controller.set('yearRange', models.yearRange);
        controller.set('categories', models.categories);
        // controller.set('institutions', models.institutions);
    },

    actions: {

    	didTransition: function() {
            // this.controllerFor('project').set('showBrowse', true);
            return true;
        },

        getResults(){

            return this.render('components/browse-results', {
                outlet: 'browse-results',
                into: 'project', // Want it to open in the project view
                controller: 'project/browse-layers', // don't set controller to `project` or it will screw up `model`
                model: this.store.queryRecord('search', {
                        tags: this.get('browseParams.tags'),
                        text_search: this.get('browseParams.searchText')
                        // name: institutions,
                        // text_search: search,
                        // start_year: start_year,
                        // end_year: end_year
                        // reload: true
                })
            });
        }
    }
});
