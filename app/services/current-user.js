import Ember from 'ember';

const {
    // isEmpty,
    // RSVP,
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
                set(_this, 'user', user);
            });
        } catch(err) {

        }
        set(this, 'tags', {});
    }
});
