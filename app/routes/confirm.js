import Ember from 'ember';

const { get, Route, inject: { service } } = Ember;

export default Route.extend({
    currentUser: service(),

    model(params) {
        return this.store.query('confirmation-token', { confirm_token: params.confirm_token });
    },

    afterModel() {
        if (this.modelFor(this.routeName).isLoaded) {
            get(this, 'currentUser').reLoad();
            this.transitionTo('index');
        }
    }
});
