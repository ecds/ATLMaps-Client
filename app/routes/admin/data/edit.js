import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
    model(params) {
        return this.store.findRecord('vector-layer', params.layer_id);
    },

    setupController(controller, model, params) {
        // Call _super for default behavior
        this._super(controller, model, params);
    }
});
