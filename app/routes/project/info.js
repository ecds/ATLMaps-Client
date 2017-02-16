import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({

    actions: {
        // Action to update wheather or not we're going to show the intro modal.
        showHideIntro: (seen) => {
            this.controllerFor('project.info').set('introSeen', seen);
        }
    }
});
