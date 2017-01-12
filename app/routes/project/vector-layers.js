import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({

    actions: {

        toggleVectorLayer(layer) {
            // Toggle the layer's model attribute.
            get(layer, 'opacity') === 0 ? layer.setProperties({ opacity: 10 }) : layer.setProperties({ opacity: 0 });
            return true;
        }
    }
});
