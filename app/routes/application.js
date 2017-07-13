import Ember from 'ember';

/**
 * Ember application route.
 *
 */

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const {
    Route,
    debug,
    get,
    inject: {
        service
    },
    set
} = Ember;

export default Route.extend(ApplicationRouteMixin, {
    currentUser: service(),
    flashMessage: service(),
    session: service(),

    sessionAuthenticated() {
        this._super(...arguments);
        set(this.controller, 'showingLogin', false);
    },

    actions: {
        error(err) {
            debug(err);
        },

        didTransition() {
            if (!get(this, 'currentUser.displayname')) {
                get(this, 'currentUser').load();
            }
        },

        toggleShowingLogin() {
            this.controller.toggleProperty('showingLogin');
        }
    }
});
