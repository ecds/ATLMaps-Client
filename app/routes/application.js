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
    }
} = Ember;

export default Route.extend(ApplicationRouteMixin, {
    currentUser: service(),
    flashMessage: service(),
    session: service(),

    actions: {
        error(err) {
            debug(err);
        }
    }
});
