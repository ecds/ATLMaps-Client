import Ember from 'ember';

export default Ember.Component.extend({
    
    actions: {
        opacityChange: function() {
            //console.log(this.layer);
            var layerName = this.layer;
            var value = Ember.$("input."+layerName).val();
            console.log(value);
            var opacity = value / 10;
            Ember.$("#map div."+layerName+",#map img."+layerName).css({'opacity': opacity});
        }
    }
});
