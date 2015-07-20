import Ember from 'ember';

export default Ember.Component.extend({

	projects: function(){
		return this.store.query('project', { user_id: this.session.get('content.secure.user.id')});
	}.property()
});
