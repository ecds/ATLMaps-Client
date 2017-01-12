/** @public
 * Component that inplamnets opacity sliders for raster layers
 * using noUiSlider (https://refreshless.com/nouislider/)/
*/
import Ember from 'ember';

/* globals noUiSlider */

const {
    $,
    Component,
    get,
    inject: {
        service
    },
    set
} = Ember;

export default Component.extend({

    mapObject: service(),
    classNames: ['opacity-slider'],

    didInsertElement() {
        const self = this;
        const layer = get(this, 'layer') || false;
        // const projectLayers = get(this, 'mapObject.projectLayers.rasters');

        let startOpacity = 10;
        if (layer) {
            startOpacity = layer.set('opacity', 10);
        }
        const options = {
            start: startOpacity,
            connect: false,
            range: {
                min: 0,
                max: 10
            }
        };

        const slider = document.getElementById(layer.get('slider_id'));

        noUiSlider.create(slider, options, true);

        slider.noUiSlider.on('update', (values, handle) => {
            const opacity = values[handle] / 10;
            // Get the Leaflet object and use its `setOpacity` to, well, set the opacity.
            get(self, 'mapObject.projectLayers.rasters')[get(layer, 'slug')].setOpacity(opacity);
            layer.setProperties({ opacity });
            if (layer !== false) {
                layer.setProperties({
                    opacity: values[handle]
                });
            }
        });

        set(layer, 'sliderObject', slider.noUiSlider);

        // Make a reference so we can destroy on exit.
        set(this, 'slider', slider);

        // Watch the toggle check box to show/hide all raster layers.
        // const showHideSwitch = document.getElementById('toggle-layer-opacity');
        // showHideSwitch.addEventListener('change', () => {
        //     if ($('#toggle-layer-opacity').prop('checked')) {
        //         Object.values(projectLayers).forEach(() => {
        //             slider.noUiSlider.set(10);
        //         });
        //     } else {
        //         Object.values(projectLayers).forEach(() => {
        //             slider.noUiSlider.set(0);
        //         });
        //     }
        // });
    },

    willDestroyElement() {
        get(this, 'slider').noUiSlider.destroy();
        document.removeEventListener('click', this.get('toggle'));
    }

});
