import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({

    actions: {

        hideLayer(layer) {
            console.log('layer', layer.get('showing'));
            if (get(layer, 'opacity') === 0) {
                layer.setProperties({ opacity: 10 });
            } else {
                layer.setProperties({ opacity: 0 });
            }
            console.log('layer', layer.get('showing'));
        }
    }
});
