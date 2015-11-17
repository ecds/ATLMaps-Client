import Ember from 'ember';
/* globals noUiSlider */
export default Ember.Component.extend({
    // didRender: function(){console.log('grrrrrr');},
    didInsertElement: function() {
        // console.log(this.get('layers'));
        // Ember.$.each(this.get('layers'), function(index, layer){
            var layer = this.get('layer')
            console.log(layer);
            var options = {
                start: [ 10 ],
                connect: false,
                range: { 'min': 0, 'max': 10 }
            };

            var slider = document.getElementById(layer.get('slider_id'));

            // The slider drops out when we transition but noUiSlider thinks
            // the slider has already been initialized. So, if the slider is
            // "initalized", we destroy. Otherwise, we just initalize it.
            try {
                slider.noUiSlider.destroy();
            }
            catch(err){/* don't care */}

            try {
                noUiSlider.create(slider, options, true);
            }
            catch(err){/* again, don't care*/}

            // Change the opactity when a user moves the slider.
            var valueInput = document.getElementById(layer.get('slider_value_id'));
            try {
                slider.noUiSlider.on('update', function(values, handle){
                    valueInput.value = values[handle];
                    var opacity = values[handle] / 10;
                    Ember.$("#map div."+layer.get('layer')+",#map img."+layer.get('layer')).css({'opacity': opacity});
                });
            }
            catch(err){/* still don't care */}
            try {
                valueInput.addEventListener('change', function(){
                    slider.noUiSlider.set(this.value);
                });
            }
            catch(err){/* for real don't care */}

            // Watch the toggle check box to show/hide all raster layers.
            var showHideSwitch = document.getElementById('toggle-layer-opacity');
            showHideSwitch.addEventListener('click', function(){
                if (Ember.$("input#toggle-layer-opacity").prop("checked")){
                    slider.noUiSlider.set(10);
                }
                else{
                    slider.noUiSlider.set(0);
                }
            });
        // });
    }
});
