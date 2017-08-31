import Ember from 'ember';

/* globals L */

const { Mixin, RSVP, get, run, set, inject: { service } } = Ember;

export default Mixin.create({
    mapObject: service(),

    model(queryParams) {
        return RSVP.hash({
            rasters: this.get('store').query('raster-layer', { names: queryParams.maps }) || [],
            vectors: this.get('store').query('vector-layer', { names: queryParams.maps }) || []
        });
    },

    activate() {
        run.scheduleOnce('afterRender', () => {
            get(this, 'mapObject').createMap();
            const map = this.get('mapObject.map');
            const currentBounds = get(this, 'mapObject.allBounds');
            try {
                get(this, 'currentModel.rasters').forEach((raster) => {
                    raster.setProperties({ active_in_list: true, opacity: 1 });
                    get(this, 'mapObject').mapSingleLayer(raster);
                    // TODO: This needs be be a reusable function
                    const layerBounds = L.latLngBounds(
                        L.latLng(raster.get('miny'), raster.get('minx')),
                        L.latLng(raster.get('maxy'), raster.get('maxx'))
                    );
                    set(this, 'mapObject.allBounds', currentBounds.extend(layerBounds));
                });
            } catch(error) {
                // Don't care.
            }

            try {
                get(this, 'currentModel.vectors').forEach((vector) => {
                    vector.setProperties({ active_in_list: true, opacity: 1 });
                    get(this, 'mapObject').mapSingleLayer(vector);
                    // TODO: This needs be be a reusable function
                    const layerBounds = L.latLngBounds(
                        L.latLng(vector.get('miny'), vector.get('minx')),
                        L.latLng(vector.get('maxy'), vector.get('maxx'))
                    );
                    set(this, 'mapObject.allBounds', currentBounds.extend(layerBounds));
                });
            } catch(error) {
                // Don't care.
            }
            map.fitBounds(get(this, 'mapObject.allBounds'));
            // TODO This was too restrictive. The idea was to limit the bounds
            // when a raster is the base layer. Needs rethinking.
            // map.setMaxBounds(get(this, 'mapObject.allBounds'));
            map.setMinZoom(map.getZoom());
            // TODO get rid of this.
            // Activate the according from MaterializeCSS.
            // $('.collapsible').collapsible();
            get(this, 'mapObject.baseMaps.street').addTo(map);
            // $('.layer-item-body').first().slideToggle();
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
        set(this.controller, 'vectors', null); // Clear checked institution
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
