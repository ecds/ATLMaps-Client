import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		addLayer: function(){
			
			var layer = this.get('layer');

			this.sendAction('action', layer);
		}
	}
});
