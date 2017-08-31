import Ember from 'ember';
import MapLayerMixin from '../mixins/map-layer';
/* globals L */
const { $, Route, get, run, set, inject: { service } } = Ember;

export default Route.extend(MapLayerMixin, {
    dataColors: service(),
    mapObject: service(),

    setColor(layer, color) {
        get(this, 'dataColors.embedColors').find((color_values) => {
            if (layer.filters.length > 0) {
                return false;
            }
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

        // We have to wait till the map is set up.
        run.scheduleOnce('afterRender', () => {
            get(this, 'mapObject.map').on('click', () => {
                this.controllerFor('embed').set('showing', false);
            });
            this.controllerFor('embed').set('rasterOnly', false);
            // Deal with vector layers.
            const vector = get(model.vectors, 'firstObject');
            // FIXME: This is doubeling down on the hack to make the HOLC
            // layer work. Plan is to address this when we move to ember-leaflet.
            if ((vector) && (Object.keys(vector.get('filters')).length) < 1) {
                this.setColor(vector, params.queryParams.color);
                get(this, 'mapObject.updateVectorStyle')(vector);
                this.controllerFor('embed').set('layer', get(model.vectors, 'firstObject'));
            }

            // Deal with raster layers.
            const raster = get(model.rasters, 'firstObject');
            if (raster) {
                // If the embed calls for a raster and a vecotr, we show the metadata
                // for the vector layer.
                if (!vector) {
                    this.controllerFor('embed').set('layer', raster);
                    this.controllerFor('embed').set('rasterOnly', true);
                } else {
                    const baseMaps = get(this, 'mapObject.baseMaps');
                    set(baseMaps, 'greyscale', L.layerGroup([get(raster, 'leaflet_object'), baseMaps.greyscale]));
                }
                this.controllerFor('embed').set('raster', raster);
            }
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
