import Ember from 'ember';

export default Ember.Component.extend({

	edit: false,

	didInsertElement: function(){
		if (this.get('mode') === 'edit'){
			this.set('edit', true);
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
