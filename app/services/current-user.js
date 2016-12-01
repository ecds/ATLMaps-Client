import Ember from 'ember';

const {
    Service,
    inject: {
        service
    },
    set
} = Ember;

export default Service.extend({
    session: service('session'),
    store: service(),

    init() {
        this._super(...arguments);
        let userId = this.get('session.data.authenticated.user.id');
        let _this = this;
        try {
            this.get('store').findRecord('user', userId).then(function(user) {
                console.log('user', user);
                set(_this, 'user', user);
            });
        } catch(err) {
            // TODO something with this caught error.
            /* err */
        }
        set(this, 'tags', {});
        set(this, 'previous', '');
    }
});
