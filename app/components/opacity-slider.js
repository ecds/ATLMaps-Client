import Ember from 'ember';

export default Ember.Component.extend({
	opacityslider: function() {
        
        var layer = DS.PromiseObject.create({
            promise: App.Layer.store.find('layer', this.layerID)
        });
        
        layer.then(function() {
            var layerName = layer.get('layer');
            var slider = Ember.$(".slider."+layerName).noUiSlider({
              start: [ 10 ],
              connect: false,
              range: {
                'min': 0,
                'max': 10
              }
            });
          });
    }.property('layer'),
    
    actions: {
        opacityChange: function() {
            var layerName = this.layer;
            var value = Ember.$("input."+layerName).val();
            var opacity = value / 10;
            Ember.$("#map div."+layerName+",#map img."+layerName).css({'opacity': opacity});
        }
    }
});
