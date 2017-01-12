import Ember from 'ember';

/* globals L */

const { $, Route, RSVP, get, run, set, inject: { service } } = Ember;

export default Route.extend({
    mapObject: service(),

    model(queryParams) {
        return RSVP.hash({
            rasters: this.get('store').query('raster-layer', { names: queryParams.maps }),
            vectors: this.get('store').query('vector-layer', { names: queryParams.data })
        });
    },
    afterModel() {

    },

    activate() {
        let _this = this;
        // console.log('map', map);
        run.scheduleOnce('afterRender', function() {
            get(_this, 'mapObject').createMap();
            let map = _this.get('mapObject.map');
            get(_this, 'currentModel.rasters').forEach(function(raster) {
                get(_this, 'mapObject').mapSingleLayer(raster);

                // TODO: This needs be be a reusable function
                let layerBounds = L.latLngBounds(
                    L.latLng(raster.get('miny'), raster.get('minx')),
                    L.latLng(raster.get('maxy'), raster.get('maxx'))
                );

                let currentBounds = get(_this, 'mapObject.allBounds');
                set(_this, 'mapObject.allBounds', currentBounds.extend(layerBounds));

            });
            map.fitBounds(get(_this, 'mapObject.allBounds'));
            $('.collapsible').collapsible();
            // get(_this, 'currentModel.vectors').forEach(function(vector) {
            //     get(_this, 'mapObject').mapLayer(vector);
            // });
        });


    }

});
