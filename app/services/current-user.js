import Ember from 'ember';

/**
 * @public
 * Service to track currently logged in user.
 * @type {Object}
 */
const {
    inject: {
        service
    },
    Service
} = Ember;

export default Service.extend({
    session: service('session'),
    store: service(),

    load() {
        if (this.get('session.isAuthenticated')) {
            return this.get('store').queryRecord('user', { me: true }).then((user) => {
                this.set('user', user);
            });
        }
        return false;
    }
    // if (get(this, 'session.isAuthenticated')) {
    //     return get(this, 'store').find('user', 'me').then((user) => {
    //         self.set('user', user);
    //     });
    // }
});
