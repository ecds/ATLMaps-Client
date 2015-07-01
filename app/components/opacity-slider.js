import Ember from 'ember';

export default Ember.Component.extend({
    
    actions: {
        opacityChange: function() {
            var layerName = this.layer;
            var value = Ember.$("input."+layerName).val();
            var opacity = value / 10;
            Ember.$("#map div."+layerName+",#map img."+layerName).css({'opacity': opacity});
        }
    }
});