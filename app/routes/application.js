import Ember from 'ember';

/**
 * Ember application route.
 *
 */

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const {
    Route,
    debug,
    inject: {
        service
    },
    set
} = Ember;

export default Route.extend(ApplicationRouteMixin, {
    flashMessage: service(),

    sessionAuthenticated() {
        this._super(...arguments);
        set(this.controller, 'showingLogin', false);
    },

    actions: {
        error(err) {
            debug(err);
        },

        toggleShowingLogin() {
            this.controller.toggleProperty('showingLogin');
        }
    }
});
