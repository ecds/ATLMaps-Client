import Ember from 'ember';
/* globals noUiSlider */
export default Ember.Component.extend({

    classNames: ['opacity-slider'],

    didInsertElement: function(){
        var layer = this.get('layer');
        var options = {
            start: [ 10 ],
            connect: false,
            range: {
                'min': 0,
                'max': 10
            }
        };

        var slider = document.getElementById(layer.get('slider_id'));

        noUiSlider.create(slider, options, true);

        // Change the opactity when a user moves the slider.
        var valueInput = document.getElementById(layer.get('slider_value_id'));

        slider.noUiSlider.on('update', function(values, handle){
            valueInput.value = values[handle];
            var opacity = values[handle] / 10;
            Ember.$("#map div."+layer.get('slug')+",#map img."+layer.get('slug')).css({'opacity': opacity});
        });

        valueInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });

        // Make a reference so we can destroy on exit.
        Ember.set(this, 'slider', slider);

        // Watch the toggle check box to show/hide all raster layers.
        let showHideSwitch = document.getElementById('toggle-layer-opacity');
        showHideSwitch.addEventListener('click', function(){
            if (Ember.$("input#toggle-layer-opacity").prop("checked")){
                slider.noUiSlider.set(10);
            }
            else{
                slider.noUiSlider.set(0);
            }
        });

        Ember.set(this, 'toggle', showHideSwitch);
    },

    willDestroyElement(){
        this.get('slider').noUiSlider.destroy();
        document.removeEventListener('click', this.get('toggle'));
    }

});
