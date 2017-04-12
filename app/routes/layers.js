/**
 * @public
 * Route to display layers outside of a project.
 * NOTE: Hopefully we can get rid of these try/catch handlers when we move to
 * JSONAPI. Somthing changed and Ember Data is not liking empty responses when
 * quering the store.
 */
import Ember from 'ember';

/* globals L */

const { $, Route, RSVP, get, run, set, inject: { service } } = Ember;

export default Route.extend({
    mapObject: service(),

    model(queryParams) {
        return RSVP.hash({
            rasters: this.get('store').query('raster-layer', { names: queryParams.maps }) || [],
            vectors: this.get('store').query('vector-layer', { names: queryParams.maps }) || []
        });
    },

    activate() {
        const self = this;
        run.scheduleOnce('afterRender', () => {
            get(self, 'mapObject').createMap();
            const map = self.get('mapObject.map');
            const currentBounds = get(self, 'mapObject.allBounds');
            try {
                get(self, 'currentModel.rasters').forEach((raster) => {
                    raster.setProperties({ active_in_list: true, opacity: 1 });
                    get(self, 'mapObject').mapSingleLayer(raster);
                    // TODO: This needs be be a reusable function
                    const layerBounds = L.latLngBounds(
                        L.latLng(raster.get('miny'), raster.get('minx')),
                        L.latLng(raster.get('maxy'), raster.get('maxx'))
                    );
                    set(self, 'mapObject.allBounds', currentBounds.extend(layerBounds));
                });
            } catch(error) {
                // Don't care.
            }

            try {
                get(self, 'currentModel.vectors').forEach((vector) => {
                    // set(vector, 'active_in_list', true);
                    vector.setProperties({ active_in_list: true, opacity: 1 });
                    get(self, 'mapObject').mapSingleLayer(vector);
                    // TODO: This needs be be a reusable function
                    const layerBounds = L.latLngBounds(
                        L.latLng(vector.get('miny'), vector.get('minx')),
                        L.latLng(vector.get('maxy'), vector.get('maxx'))
                    );
                    set(self, 'mapObject.allBounds', currentBounds.extend(layerBounds));
                });
            } catch(error) {
                // Don't care.
            }
            map.fitBounds(get(self, 'mapObject.allBounds'));
            // TODO get rid of this.
            // Activate the according from MaterializeCSS.
            $('.collapsible').collapsible();
            get(this, 'mapObject.baseMaps.street').addTo(map);
        });
    },

    tearDown: function tearDown() {
        // Clear the vector layers that are marked active in this project.
        const vectors = this.store.peekAll('vector-layer');
        vectors.forEach((vector) => {
            vector.setProperties({
                active_in_project: false
            });
        });
        // Clear the raster layers that are marked active in this project.
        const rasters = this.store.peekAll('raster-layer');
        rasters.forEach((raster) => {
            raster.setProperties({
                active_in_project: false
            });
        });

        set(this.controller, 'rasters', null);
        set(this.controller, 'vectors', null);        // Clear checked institution
        const institutions = this.store.peekAll('institution');
        institutions.setEach('checked', false);

        // Clear the map.
        get(this, 'mapObject.map').remove();
        set(this, 'mapObject.map', '');
    }.on('deactivate'), // This is the hook that makes the run when we exit the project route.

    updatedResults(type) {
        set(this.controller, `${type}_diffResults`, true);
        run.later(this, () => {
            set(this.controller, `${type}_diffResults`, false);
        }, 300);
    },

    actions: {
        updateProject() {
            return true;
        },

        cancleUpdate() {
            return false;
        }
    }
});
