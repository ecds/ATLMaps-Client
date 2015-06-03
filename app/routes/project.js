import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
        var project = this.store.find('project', params.project_id);
        return project;
    },

    afterModel: function() {
        var projectTitle = this.modelFor('project').get('name');
        Ember.$(document).attr('title', 'ATLMaps: ' + projectTitle);
    }
});
