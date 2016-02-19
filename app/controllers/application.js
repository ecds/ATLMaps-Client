import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),

	editSuccess: function(){
        return null;
    }.property(),

    editFail: function(){
        return null;
    }.property(),

	// initMenu: function(){
    //   Ember.run.scheduleOnce('afterRender', this, function() {
    //     Ember.$('.collapse').collapse({toggle: false});
    //   });
    // }.property(),

	actions: {
		invalidateSession() {
	      this.get('session').invalidate();
	    }
	}


});
