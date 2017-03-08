import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({

    actions: {

        hideLayer(layer) {
            if (get(layer, 'opacity') === 0) {
                layer.setProperties({ opacity: 10 });
            } else {
                layer.setProperties({ opacity: 0 });
            }
        }
    }
});
