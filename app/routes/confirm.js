import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
    currentUser: service(),
    session: service(),

    model(params) {
        return this.store.query('confirmation-token', { confirm_token: params.confirm_token });
    },

    afterModel() {
        if (this.modelFor(this.routeName).isLoaded) {
            // if (get(this, 'session.isAuthenticated')) {
            //     get(this, 'session').invalidate();
            // }
            this.transitionTo('index');
        }
    }
});
