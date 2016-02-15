import Ember from 'ember';

export default Ember.Route.extend({
    // notify: Ember.inject.service('notify'),

    actions: {
        // Action to update wheather or not we're going to show the intro modal.
        showHideIntro: function(seen){
            this.controllerFor('project.info').set('introSeen', seen);
        },

        updateProjectInfo: function(model) {
            /* Action that updates the title, description and
            published status of a project. */
            const flashMessages = Ember.get(this, 'flashMessages');
            model.save().then(function() {
                // Success callback
                // Show confirmation.
                flashMessages.success('Project Updated!');
                }, function() {
                    // Error callback
                    flashMessages.danger('Something went worng. Info was not updated.');
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
