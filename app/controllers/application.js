import Ember from 'ember';
/* global gnMenu */

export default Ember.Controller.extend({
	initMenu: function(){
      Ember.run.scheduleOnce('afterRender', this, function() {
        new gnMenu( document.getElementById( 'gn-menu' ) );
      });
    }.property()
});
