import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	
	myCollaborations: function() {
        return this.store.query('project', {collaborations: this.get('session.session.content.secure.user.id')});
    }.property()
});
