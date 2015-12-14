import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),

	initMenu: function(){
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$('.collapse').collapse({toggle: false});
      });
    }.property(),

	actions: {
		invalidateSession() {
	      this.get('session').invalidate();
	    }
	}


});
