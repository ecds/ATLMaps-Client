import Ember from 'ember';

// NOTE: This is a legacy route that we are going to keep around as some grant
// applications have links with this route.

// TODO: Decide if we want to keep this around.

const { Route } = Ember;

export default Route.extend({
    actions: {
        didTransition() {
            this._super(...arguments);
            this.transitionTo('project.info', 'explore');
        }

    }
});
