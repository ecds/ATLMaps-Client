/**
 * @public
 * Component that shows or hides all layers of a type.
*/

import Ember from 'ember';

const { Component, get, inject: { service } } = Ember;

export default Component.extend({
    mapObject: service(),
    store: service(),

    actions: {
        /**
         * @public
         * @method
         * @param {object} layers array of `raster_layer`s or `vector_layer`s
         * Hopefully most, if not all, will go away when we refactor for ember-leaflet.
         */
        toggleAll(layers, type) {
            const store = get(this, 'store');
            const toggleSwitch = document.getElementById('toggle-all');
            store.peekAll(type).forEach((layer) => {
                // Only toggle the ones that have been added to the map, not all that
                // are currently in the store.
                if (get(layer, 'active_in_project')) {
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
                }
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
