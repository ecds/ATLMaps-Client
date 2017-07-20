import Ember from 'ember';
import MapLayerMixin from '../mixins/map-layer';

const { Route, get, inject: { service } } = Ember;

export default Route.extend(MapLayerMixin, {
    dataColors: service(),

    setColor(layer, color) {
        get(this, 'dataColors.embedColors').find(function(color_values) {
            if (color_values.name === color) {
                layer.setProperties(
                    {
                        colorName: color_values.name,
                        colorHex: color_values.hex
                    }
                );
                return color_values.name;
            }
        });
    },

    setupController(controller, model, params) {
        this._super(controller, model, params);
        const vector = get(model.vectors, 'firstObject');
        this.setColor(vector, params.queryParams.color);
        this.controllerFor('embed').set('vector', get(model.vectors, 'firstObject'));
    },

    actions: {
        setColor() {
            //
        },

        setBase() {
            //
        },

        setRasterBase() {
            //
        }
    }
});
