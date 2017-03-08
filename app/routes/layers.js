/**
 * @public
 * Route to display layers outside of a project.
 */
import Ember from 'ember';

/* globals L */

const { $, Route, RSVP, get, run, set, inject: { service } } = Ember;

export default Route.extend({
    mapObject: service(),

    model(queryParams) {
        return RSVP.hash({
            rasters: this.get('store').query('raster-layer', { names: queryParams.maps }),
            vectors: this.get('store').query('vector-layer', { names: queryParams.maps })
        });
    },
    afterModel() {
        // const vectors = this.store.peekAll('vector-layer');
        // const rasters = this.store.peekAll('raster-layer');
        // console.log(vectors.get('content')[0])
        // if (vectors.get('length') === 1) {
        //     set(vectors.get('content')[0], 'active_in_list', true);
        // }
    },

    activate() {
        const self = this;
        run.scheduleOnce('afterRender', () => {
            get(self, 'mapObject').createMap();
            const map = self.get('mapObject.map');
            const currentBounds = get(self, 'mapObject.allBounds');
            get(self, 'currentModel.rasters').forEach((raster) => {
                get(self, 'mapObject').mapSingleLayer(raster);

                // TODO: This needs be be a reusable function
                const layerBounds = L.latLngBounds(
                    L.latLng(raster.get('miny'), raster.get('minx')),
                    L.latLng(raster.get('maxy'), raster.get('maxx'))
                );
                set(self, 'mapObject.allBounds', currentBounds.extend(layerBounds));
            });
            get(self, 'currentModel.vectors').forEach((vector) => {
                get(self, 'mapObject').mapSingleLayer(vector);
                // TODO: This needs be be a reusable function
                const layerBounds = L.latLngBounds(
                    L.latLng(vector.get('miny'), vector.get('minx')),
                    L.latLng(vector.get('maxy'), vector.get('maxx'))
                );
                set(self, 'mapObject.allBounds', currentBounds.extend(layerBounds));
            });
            map.fitBounds(get(self, 'mapObject.allBounds'));
            // TODO get rid of this.
            // Activate the according from MaterializeCSS.
            $('.collapsible').collapsible();
            get(this, 'mapObject.baseMaps.street').addTo(map);
        });
    }
});
