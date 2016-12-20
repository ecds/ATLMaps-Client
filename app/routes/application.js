import Ember from 'ember';

/**
 * Ember application route.
 *
 */

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { Route, inject: { service } } = Ember;

export default Route.extend(ApplicationRouteMixin, {
    currentUser: service()
});
