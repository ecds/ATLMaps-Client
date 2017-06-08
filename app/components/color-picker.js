/**
 * @public
 * Component to set color for a vector layer.
 */
import Ember from 'ember';

const {
    Component,
    get,
    set,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    dataColors: service(),
    mapObject: service(),

    classNames: ['color-picker'],

    colors: [],

    didInsertElement() {
        const group = get(this, 'projectLayer.vector_layer.data_type');
        if (group === 'point-data') {
            set(this, 'colors', get(this, 'dataColors.safeMarkerColors'));
        } else {
            set(this, 'colors', get(this, 'dataColors.safeShapeColors'));
        }
    },

    actions: {
        // Updates the color on the map, but does not save it.
        previewColor(color, index) {
            const projectLayer = get(this, 'projectLayer');

            projectLayer.setProperties({
                marker: index
            });
            const vector = projectLayer.get('vector_layer');
            vector.setProperties({
                colorName: color.name,
                colorHex: color.hex
            });
            get(this, 'mapObject').updateVectorStyle(vector, color);
        },

        // This is to reset the color when the cussor leaves the color picker
        // without having set a new color.
        // NOTE: I really hope this gets simplier when we move to JSONAPI.
        reset() {
            // const self = this;
            const projectLayer = get(this, 'projectLayer');
            projectLayer.rollbackAttributes();
            const vector = get(this, 'projectLayer.vector_layer');
            vector.setProperties({
                colorName: get(projectLayer, 'colorName'),
                colorHex: get(projectLayer, 'colorHex')
            });
            get(this, 'mapObject').updateVectorStyle(vector);
        }
    }

});
