import Ember from 'ember';

export default Ember.Component.extend({

    dataColors: Ember.inject.service('data-colors'),

    classNames: ['color-picker', 'row'],

    colors: function(){
        let layer = this.get('layer');
        let group = layer.get('vector_layer_id.data_type');
        if(group === 'point-data'){
            return this.get('dataColors.markerColors');
        }
        else {
            return this.get('dataColors.shapeColors');
        }
    }.property(),

    actions: {
        setColor(colorClass, hex, layer){
            let colorGroup;
            if (layer.get('vector_layer_id.data_type') === 'point-data'){
                colorGroup = this.get('dataColors.markerColors');
            }
            else {
                colorGroup = this.get('dataColors.shapeColors');
            }
            let newColor = Object.keys(colorGroup).indexOf(colorClass);
            layer.setProperties({marker: newColor});
            layer.save().then(function(){
                layer.get('vector_layer_id').then(function(vector){
                    let slug = vector.get('slug');
                    let dataType = vector.get('data_type');
                    if (dataType === 'polygon'){
                        Ember.$('path.'+slug).attr({stroke: hex, fill: hex});
                    }
                    else if (dataType === 'line-data') {
                        Ember.$('path.'+slug).attr({stroke: hex});
                    }
                    else if (dataType === 'point-data') {
                        Ember.$('.leaflet-marker-icon.'+slug).css({color: hex});
                    }
                });
            }).catch(/*fail*/);

        }
    }

});
