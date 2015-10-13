import Ember from 'ember';

export default Ember.Component.extend({
	projects: function(){
		return this.store.find('project');
	}.property()
});
