import Ember from 'ember';
/* globals noUiSlider, DS */

export default Ember.Component.extend({
    
    didInsertElement: function(){
        
        Ember.run.next(this, 'initSlider');

	},

    initSlider: function(){
    //     Ember.run.later(this, function(){
    //     var _this = this;
    //     var layerID = _this.get('layer.id');


    //     var options = {
    //         start: [ 10 ],
    //         connect: false,
    //         range: {
    //             'min': 0,
    //             'max': 10
    //         }
    //     };

    //     var layer = DS.PromiseObject.create({
    //         promise: _this.store.findRecord('raster-layer', layerID)
    //     });

    //     layer.then(function() {
    //         var slider = document.getElementById(layer.get('slider_id'));
    //         //var slider = Ember.$("#"+layer.get('slider_id')[0]);
    //         noUiSlider.create(slider, options, true);

    //         var valueInput = document.getElementById(layer.get('slider_value_id'));
    //         slider.noUiSlider.on('update', function(values, handle){
    //             valueInput.value = values[handle];
    //             var opacity = values[handle] / 10;
    //             Ember.$("#map div."+layer.get('layer')+",#map img."+layer.get('layer')).css({'opacity': opacity});
    //         });
    //         valueInput.addEventListener('change', function(){
    //             console.log(this.value);
    //             slider.noUiSlider.set(this.value);
    //         });
    //     });
    // }, 1500);
    },

});