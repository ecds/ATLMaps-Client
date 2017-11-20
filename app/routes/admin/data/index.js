import Ember from 'ember';

const { Route, get, inject: { service } } = Ember;

export default Route.extend({
    flashMessage: service(),

    model() {
        return this.store.query('vector-layer', { limit: 100 });
    },

    actions: {
        save(layer) {
            const flash = get(this, 'flashMessage');
            const saveType = get(layer, 'dirtyType');
            layer.save().then(() => {
                if (saveType !== 'updated') {
                    get(layer, 'vector_feature').forEach((vf) => {
                        vf.save().then(() => {
                            flash.savedMessage('Feature Saved!');
                        }, (error) => {
                            flash.failedMessage(`Feature Did Not Save :( ${error.message}`);
                        });
                    });
                }
                flash.savedMessage('Layer Saved!');
            }, (error) => {
                flash.failedMessage(`Layer Did Not Save :( ${error.message}`);
            });
        },

        delete(layer) {
            const d = confirm(`Delete ${get(layer, 'title')}`);
            if (d === true) {
                layer.destroyRecord();
            }
        }
    }
});
