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
    isShowing: false,
    classNames: ['vector-options', 'pull-right'],

    click() {
        this.toggleProperty('isShowing');
    },

    actions: {
        toggleModal() {
            this.toggleProperty('isShowing');
            if (this.get('layer.hasDirtyAttributes')) {
                this.get('layer').rollbackAttributes();
                let color;
                let layer = this.get('layer.vector_layer_id');
                if (layer.get('data_type') === 'point-data') {
                    color = this.get('dataColors.markerColors')[this.get('layer.marker')];
                } else {
                    color = this.get('dataColors.shapeColors')[this.get('layer.marker')];
                }
                layer.setProperties({
                    colorName: color.name,
                    colorHex: color.hex
                });
                this.get('mapObject').updateVectorStyle(this.get('layer.vector_layer_id'));
            }
        }
    }

});
