import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		addLayer: function(){
			console.log(this.get('param'));

			this.sendAction('action', this.get('param'));
		}
	}
});
