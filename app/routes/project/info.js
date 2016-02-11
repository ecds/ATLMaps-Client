import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        // Action to update wheather or not we're going to show the intro modal.
        showHideIntro: function(seen){
            this.controllerFor('project.info').set('introSeen', seen);
            console.log('after setting ' + this.controllerFor('project').get('introSeen'));
        }
    }
});
