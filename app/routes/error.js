import Ember from 'ember';

const { Route, get, inject: { service } } = Ember;

export default Route.extend({
    flashMessage: service(),

    setupController(controller, model, params) {
        // Call _super for default behavior
        this._super(controller, model, params);
        this.controllerFor('error').set('flashMessage', get(this, 'flashMessage'));
    }
});
