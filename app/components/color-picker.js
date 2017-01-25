/**
 * @public
 * Component to set color for a vector layer.
 */
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

    colors() {
        const layer = this.get('layer');
        const group = layer.get('vector_layer_id.data_type');
        if (group === 'point-data') {
            return this.get('dataColors.markerColors');
        }

        return this.get('dataColors.shapeColors');
    },

    mouseLeave() {
        this.get('layer').rollbackAttributes();
    },

    actions: {
        previewColor(color, layer, index) {
            layer.setProperties({
                marker: index
            });
            const self = this;
            layer.get('vector_layer_id').then((vector) => {
                vector.setProperties({
                    colorName: color.name,
                    colorHex: color.hex
                });
                self.get('mapObject').updateVectorStyle(vector, color);
            });
        }
    }

});
