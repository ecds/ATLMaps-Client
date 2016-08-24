import Ember from 'ember';

const {
    Component,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    dataColors: service(),
    mapObject: service(),

    classNames: ['color-picker'],

    colors: function() {
        let layer = this.get('layer');
        let group = layer.get('vector_layer_id.data_type');
        if (group === 'point-data') {
            return this.get('dataColors.markerColors');
        } else {
            return this.get('dataColors.shapeColors');
        }
    }.property(),

    mouseLeave() {
        this.get('layer').rollbackAttributes();
    },

    actions: {
        previewColor(color, layer, index) {
            layer.setProperties({
                marker: index
            });
            let _this = this;
            layer.get('vector_layer_id').then(function(vector) {
                vector.setProperties({
                    color_name: color.name,
                    color_hex: color.hex
                });
                _this.get('mapObject').updateVectorStyle(vector, color);
            });
        }
    }

});
