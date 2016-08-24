import Ember from 'ember';

/* globals noUiSlider */

const {
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
        let _this = this;
        let projLayer = this.get('layer');
        let layer = projLayer.get('raster_layer_id');
        let options = {
            start: [ projLayer.get('opacity') ],
            connect: false,
            range: {
                'min': 0,
                'max': 10
            }
        };

        let slider = document.getElementById(layer.get('slider_id'));

        noUiSlider.create(slider, options, true);

        // Change the opactity when a user moves the slider.
        let valueInput = document.getElementById(layer.get('slider_id'));

        slider.noUiSlider.on('update', function(values, handle) {
            let opacity = values[handle] / 10;
            // Get the Leaflet object and use its `setOpacity` to, well, set the opacity.
            _this.get('mapObject.projectLayers')[layer.get('slug')].setOpacity(opacity);
            projLayer.setProperties({ opacity: values[handle] });
            if (opacity > 0) {
                projLayer.setProperties({ showing: true });
            } else {
                projLayer.setProperties({ showing: false });
            }
        });

        valueInput.addEventListener('change', function() {
            slider.noUiSlider.set(this.value);
        });

        // Make a reference so we can destroy on exit.
        set(this, 'slider', slider);

        // Watch the toggle check box to show/hide all raster layers.
        let showHideSwitch = document.getElementById('toggle-layer-opacity');
        showHideSwitch.addEventListener('click', function() {
            if (Ember.$('input#toggle-layer-opacity').prop('checked')) {
                slider.noUiSlider.set(10);
                projLayer.setProperties({ showing: true });
            } else {
                slider.noUiSlider.set(0);
                projLayer.setProperties({ showing: false });
            }
        });

        set(this, 'toggle', showHideSwitch);
    },

    willDestroyElement() {
        get(this, 'slider').noUiSlider.destroy();
        document.removeEventListener('click', this.get('toggle'));
    }

});
