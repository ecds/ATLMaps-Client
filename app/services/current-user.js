import Ember from 'ember';

/**
 * @public
 * Service to track currently logged in user.
 * @type {Object}
 */
const {
    Service,
    get,
    inject: {
        service
    }
} = Ember;

export default Service.extend({
    session: service('session'),
    store: service(),

    user: {},

    load() {
        const self = this;
        if (get(this, 'session.isAuthenticated')) {
            return get(this, 'store').find('user', 'me').then((user) => {
                self.set('user', user);
            });
        }
        return false;
    }
});
