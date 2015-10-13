import Ember from 'ember';

export default Ember.Component.extend({
	myCollaborations: function() {
        return this.store.query('project', {collaborations: this.session.get('content.secure.user.id')});
    }.property()
});
