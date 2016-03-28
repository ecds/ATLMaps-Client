import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),

	actions: {
		invalidateSession() {
	      this.get('session').invalidate();
	    }
	},

	// computed property - whether this current route is a project.* page
	isProjectDetail: Ember.computed('currentRouteName', function(){
			return (this.get('currentRouteName').includes("project."));
	})


});
