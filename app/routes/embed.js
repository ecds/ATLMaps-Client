import Ember from 'ember';
import MapLayerMixin from '../mixins/map-layer';

const { $, Route, get, run, inject: { service } } = Ember;

export default Route.extend(MapLayerMixin, {
    dataColors: service(),

    setColor(layer, color) {
        get(this, 'dataColors.embedColors').find((color_values) => {
            if (color_values.name === color) {
                layer.setProperties(
                    {
                        colorName: color_values.name,
                        colorHex: color_values.hex
                    }
                );
                return color_values.name;
            }
            return false;
        });
    },

    setupController(controller, model, params) {
        // Call _super for default behavior
        this._super(controller, model, params);

        // Deal with vector layers.
        const vector = get(model.vectors, 'firstObject');
        if (vector) {
            this.setColor(vector, params.queryParams.color);
            this.controllerFor('embed').set('layer', get(model.vectors, 'firstObject'));
        }

        // Deal with raster layers.
        const raster = get(model.vectors, 'firstObject');
        if (raster) {
            // If the embed calls for a raster and a vecotr, we show the metadata
            // for the vector layer.
            if (!vector) {
                this.controllerFor('embed').set('layer', get(model.rasters, 'firstObject'));
            }
            this.controllerFor('embed').set('raster', get(model.rasters, 'firstObject'));
        }
        // We have to wait till the map is set up.
        run.scheduleOnce('afterRender', () => {
            get(this, 'mapObject').switchBaseMap(params.queryParams.base);
        });
    },

    actions: {
        setOpacity() {
            const value = $(`#${get(this, 'controller.raster.name')}`).val();
            get(this, 'controller.raster.leaflet_object').setOpacity(value / 100);
        }
    }
});
