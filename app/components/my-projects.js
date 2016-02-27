import Ember from 'ember';

export default Ember.Component.extend({

	session: Ember.inject.service('session'),

	projects: function(){
		if (this.get('session.isAuthenticated')){
			return this.store.find('project', { user_id: this.get('session.session.content.secure.user.id')});
		}
		else {
			return null;
		}
	}.property()
});
