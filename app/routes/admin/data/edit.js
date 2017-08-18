import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
    flashMessage: service(),

    model(params) {
        return this.store.findRecord('vector-layer', params.layer_id);
    }

    // setupController(controller, model, params) {
    //     // Call _super for default behavior
    //     this._super(controller, model, params);
    // }
});
