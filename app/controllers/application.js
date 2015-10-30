import Ember from 'ember';

export default Ember.Controller.extend({
	initMenu: function(){
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$('.collapse').collapse({toggle: false});
      });
    }.property(),


});
