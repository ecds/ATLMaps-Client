import Ember from 'ember';

export default Ember.Component.extend({

    dataColors: Ember.inject.service('data-colors'),
    mapObject: Ember.inject.service('map-object'),

    classNames: ['color-picker'],

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

    mouseLeave(){
        this.get('layer').rollbackAttributes();
    },

    actions: {
        previewColor(color, layer){
            let _this = this;
            layer.get('vector_layer_id').then(function(vector){
                let slug = vector.get('slug');
                let dataType = vector.get('data_type');
                if (dataType === 'polygon'){
                    _this.get('mapObject.vectorLayers')[slug].setStyle({color: color.hex, fillColor: color.hex});
                }
                else if (dataType === 'line-data') {
                    _this.get('mapObject.vectorLayers')[slug].setStyle({color: color.hex});
                }
                else if (dataType === 'point-data') {
                    // The Icon class doesn't have any methods like setStyle.
                    Ember.$('.leaflet-marker-icon.'+slug).css({color: color.hex});
                }
            });
        },
        setColor(color, layer){
            // console.log(color);
            // let _this = this;
            let colorGroup;
            if (layer.get('vector_layer_id.data_type') === 'point-data'){
                colorGroup = this.get('dataColors.markerColors');
            }
            else {
                colorGroup = this.get('dataColors.shapeColors');
            }
            layer.setProperties({marker: colorGroup.indexOf(color)});
            layer.save().then(function(){
                // console.log('saving')
            }).catch(/*fail*/);

        }
    }

});
