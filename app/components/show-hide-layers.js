/**
 * @public
 * Component that shows or hides all layers of a type.
*/

import Ember from 'ember';

const { Component, get, inject: { service } } = Ember;

export default Component.extend({
    mapObject: service(),

    actions: {
        /**
         * @public
         * @method
         * @param {object} layers array of `raster_layer`s or `vector_layer`s
         */
        toggleAll(layers) {
            const toggleSwitch = document.getElementById('toggle-all');
            layers.then((activeLayers) => {
                activeLayers.forEach((layer) => {
                    if (toggleSwitch.checked) {
                        layer.setProperties({ opacity: 10 });
                        if (get(layer, 'sliderObject')) {
                            get(layer, 'sliderObject').set(10);
                        }
                    } else {
                        layer.setProperties({ opacity: 0 });
                        if (get(layer, 'sliderObject')) {
                            get(layer, 'sliderObject').set(0);
                        }
                    }
                });
            });
        },

        toggleOne(layer) {
            if (get(layer, 'opacity') === 0) {
                layer.setProperties({ opacity: 10 });
            } else {
                layer.setProperties({ opacity: 0 });
            }
        }
    }
});
