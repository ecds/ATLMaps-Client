import Ember from 'ember';

export default Ember.Route.extend({

    actions: {
        // Action to update wheather or not we're going to show the intro modal.
        showHideIntro: function(seen){
            this.controllerFor('project.info').set('introSeen', seen);
        },

        // updateProjectInfo: function(model) {
        //     /* Action that updates the title, description and
        //     published status of a project. */
        //     model.save().then(function() {
        //         // Success callback
        //         // Show confirmation.
        //         model.setProperties({edit_success: true});
        //         Ember.run.later(this, function(){
        //             model.setProperties({edit_success: false});
        //         }, 3000);
        //         }, function() {
        //             // Error callback
        //             model.setProperties({edit_fail: true});
        //             Ember.run.later(this, function(){
        //                 model.setProperties({edit_fail: false});
        //                 model.rollbackAttributes();
        //                 model.setProperties({editing: true});
        //             }, 3000);
        //
        //     });
        // },
        //
        // cancelUpdate: function(model) {
        //     /* Action that rolls back any updates that have changed
        //     in the local store but haven't been pushed to the API. */
        //     model.rollbackAttributes();
        // }
    }
});
