import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		addLayer: function(){

			this.sendAction('action', this.get('layer'));
		}
	}
});
