import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
    currentUser: service(),
    session: service(),

    model(params) {
        return this.store.query('confirmation-token', { confirm_token: params.confirm_token });
    },

    afterModel() {
        this.transitionTo('/');
    }
});
