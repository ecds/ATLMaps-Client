import Ember from 'ember';

/* globals noUiSlider */

const {
    $,
    Component,
    get,
    inject: {
        service
    },
    run,
    set
} = Ember;

export default Component.extend({

    mapObject: service(),
    classNames: ['opacity-slider'],

    didInsertElement() {
        let _this = this;
        let projLayer = get(this, 'projLayer') || false;
        let layer = get(this, 'layer');
        // console.log('projLayer', projLayer);

        let startOpacity = 10;
        if (projLayer) {
            startOpacity = projLayer.get('opacity');
        }
        let options = {
            start: startOpacity,
            connect: false,
            range: {
                'min': 0,
                'max': 10
            }
            // orientation: 'vertical'
        };

        let slider = document.getElementById(layer.get('slider_id'));

        noUiSlider.create(slider, options, true);

        // Change the opactity when a user moves the slider.
        let valueInput = document.getElementById(layer.get('slider_id'));

        slider.noUiSlider.on('update', function(values, handle) {
            let opacity = values[handle] / 10;
            // Get the Leaflet object and use its `setOpacity` to, well, set the opacity.
            get(_this, 'mapObject.projectLayers')[get(layer, 'slug')].setOpacity(opacity);
            if (projLayer !== false) {
                projLayer.setProperties({
                    opacity: values[handle]
                });
                if (opacity > 0) {
                    projLayer.setProperties({
                        showing: true
                    });
                } else {
                    projLayer.setProperties({
                        showing: false
                    });
                }

            }
        });

        valueInput.addEventListener('change', function() {
            slider.noUiSlider.set(this.value);
        });

        // Make a reference so we can destroy on exit.
        set(this, 'slider', slider);

        // Watch the toggle check box to show/hide all raster layers.
        // let showHideSwitch = document.getElementById('toggle-layer-opacity');
        // showHideSwitch.addEventListener('click', function() {
        //     if ($('input#toggle-layer-opacity').prop('checked')) {
        //         slider.noUiSlider.set(10);
        //         projLayer.setProperties({ showing: true });
        //     } else {
        //         slider.noUiSlider.set(0);
        //         projLayer.setProperties({ showing: false });
        //     }
        // });
        //
        // set(this, 'toggle', showHideSwitch);

    },

    update(slider) {
        slider.noUiSlider.updateOptions({ orientation: 'vertical' });
    },

    willDestroyElement() {
        get(this, 'slider').noUiSlider.destroy();
        document.removeEventListener('click', this.get('toggle'));
    }

});
