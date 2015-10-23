import Ember from 'ember';

export default Ember.Component.extend({

	edit: false,

	didInsertElement: function(){
        // Set which group to show from the template.
		if (this.get('mode') === 'edit'){
			this.set('edit', true);
		}
        else if (this.get('mode') === 'view'){
            this.set('projview', true);
        }
        else if (this.get('mode') === 'explore'){
            this.set('explore', true);
        }
		else if (this.get('mode') === 'browse'){
            this.set('browse', true);
        }

	},

	actions: {
		navigateProject: function(card){

            Ember.$("div.marker-data").hide();

            Ember.$(".project-nav").removeClass('active-button');

            Ember.$(".project-nav").addClass('transparent-button');

            if (Ember.$('.'+card).is(":visible")) {
                Ember.$('.'+card).slideToggle();
                Ember.$('#'+card).removeClass('active-button');
                Ember.$('#'+card).addClass('transparent-button');
            }
            else {
                Ember.$(".card").hide();
                Ember.$(".active_marker").removeClass("active_marker");
                Ember.$("."+card).slideToggle();
                Ember.$('#'+card).addClass('active-button');
                Ember.$('#'+card).removeClass('transparent-button');
            }
        },

	}
});
