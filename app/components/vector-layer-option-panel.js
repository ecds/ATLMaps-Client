import Ember from 'ember';

export default Ember.Component.extend({

    dataColors: Ember.inject.service('data-colors'),
    mapObject: Ember.inject.service('map-object'),
    isShowing: false,
    classNames: ['vector-options', 'pull-right'],

    click() {
        this.toggleProperty('isShowing');
    },
    mouseLeave(){

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
                    color_name: color.name,
                    color_hex: color.hex
                });
                console.log(this.get('layer.marker'))
                this.get('mapObject').updateVectorStyle(this.get('layer.vector_layer_id'));
            }
        }
    }

});
