import Ember from 'ember';

const { Route, get, inject: { service } } = Ember;

export default Route.extend({
    flashMessage: service(),

    actions: {

        hideLayer(layer) {
            if (get(layer, 'opacity') === 0) {
                layer.setProperties({ opacity: 10 });
            } else {
                layer.setProperties({ opacity: 0 });
            }
        },

        setColor(layer) {
            const self = this;
            layer.save().then(() => {
                get(self, 'flashMessage').savedMessage('Color Updated!');
            }, () => {
                get(self, 'flashMessage').failedMessage('BOOOOO! Something went worng. Your change was not saved. :');
            });
        }
    }
});
