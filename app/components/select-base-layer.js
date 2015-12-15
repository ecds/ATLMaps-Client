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

			if (this.get('mode') === 'edit') {
				var model = this.get('model');
				model.set('default_base_map', base);
				model.save().then(function() {
                    // Success callback
                    // Show confirmation.
                    Ember.$(".base-set-success").stop().slideToggle().delay(1500).slideToggle();
                    }, function() {
                        // Error callback
                        Ember.$(".base-set-fail").stop().slideToggle().delay(3000).slideToggle();

                });
			}
		}
	}
});
