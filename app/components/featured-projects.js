import Ember from 'ember';

export default Ember.Component.extend({

	projects: function(){
		return this.store.query('project', { featured: true});
	}.property()
});
