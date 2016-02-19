import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement: function(){
		// var model = this.get('model');
		// var base = model.get('default_base_map');

		// Ember.$("span:contains(' "+ base + "')").prev().click();
	},

	actions: {
		setBase: function(base) {
			Ember.$(".leaflet-control-layers-selector").removeAttr('checked');
			Ember.$("span:contains(' "+ base + "')").prev().click().attr('checked', 'checked');

		}
	}
});
