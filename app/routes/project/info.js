import Ember from 'ember';

export default Ember.Route.extend({

    actions: {
        // Action to update wheather or not we're going to show the intro modal.
        showHideIntro: function(seen){
            this.controllerFor('project.info').set('introSeen', seen);
        },

        updateProjectInfo: function(model) {
            /* Action that updates the title, description and
            published status of a project. */
            var _this = this;
            model.save().then(function() {
                // Success callback
                // Show confirmation.
                _this.controllerFor('project').set('editSuccess', true);
                Ember.run.later(this, function(){
                    _this.controllerFor('project').set('editSuccess', false);
                }, 3000);
                }, function() {
                    // Error callback
                    _this.controllerFor('project').set('editFail', true);
                    Ember.run.later(this, function(){
                        _this.controllerFor('project').set('editFail', false);
                    }, 3000);
                    model.rollbackAttributes();

            });
        },

        cancelUpdate: function(model) {
            /* Action that rolls back any updates that have changed
            in the local store but haven't been pushed to the API. */
            model.rollbackAttributes();
        }
    }
});
