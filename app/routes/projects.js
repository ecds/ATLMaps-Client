import Ember from 'ember';
import DS from 'ember-data';

/* globals md5 */

export default Ember.Route.extend({
	session: Ember.inject.service('session'),

	model(){
		// The API will only return published projects when asked for all.
		// We'll make seperate calls for a user's projects if a user is authenticated.
		if(this.get('session.isAuthenticated')){
			return Ember.RSVP.hash({
				published: this.store.findAll('project'),
				mine: this.store.query('project', { user_id: this.get('session.session.content.authenticated.user.id')}),
				collaborations: this.store.query('project', {collaborations: this.get('session.session.content.authenticated.user.id')})
			});
		}
		// TODO is there a way to not have to do a single item hash without
		// haveing to duplicate a bunch of stuff in the template?
		else {
			return Ember.RSVP.hash({
				published: this.store.findAll('project')
			});
		}
	},

	actions : {

        didTransition: function() {
            Ember.$(document).attr('title', 'ATLMaps: Projects');
        },

        createProject: function() {

			// Placehoder name for project.
            var newProjectName = md5((new Date()).toTimeString());

            var project = this.store.createRecord('project', {
                name: newProjectName,
				// I really hate this and there has to be a better way.
                user_id: this.get('session.session.content.authenticated.user.id'),
                published: false,
                center_lat: 33.75440100,
                center_lng: -84.3898100,
                zoom_level: 13,
                default_base_map: 'street'
            });

            var _this = this;

			// TODO this is not the pattern we use anywhere else to create/save
			// records.
            var onSuccess = function() {

                var newProject = DS.PromiseObject.create({
                    promise: _this.store.query('project', { name: newProjectName })
                });

                newProject.then(function() {
					// Set the name so we don't just have some ugly string in there.
                	newProject.get('firstObject').set('name', 'Please enter a title.');
                    _this.transitionTo('project.info', newProject.get('firstObject').id);
                });
            };
            project.save().then(onSuccess);

        },

		deleteProject: function(project) {

            var response = confirm("Are you sure you want to DELETE this project?");

            if (response === true) {
                this.store.query('project', project).then(function (project) {
                    project.destroyRecord();
                });
            }
        }
    }
});
