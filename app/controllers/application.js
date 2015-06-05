import Ember from 'ember';
/* global gnMenu */

Ember.Map = Ember.Object.extend();
var store = Ember.Map.create();

export default Ember.Controller.extend({
	initMenu: function(){
      Ember.run.scheduleOnce('afterRender', this, function() {
        new gnMenu( document.getElementById( 'gn-menu' ) );
      });
    }.property(),

  
});
