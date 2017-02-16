import Ember from 'ember';

const {
    Route,
    inject: {
        service
    },
    get,
    set,
    run
} = Ember;

export default Route.extend({
    mapObject: service(),
    flashMessage: service(),

    actions: {
        setCenterAndZoom(model) {
            // Saves the zoom level and center to the current view.
            // First we need the map object
            const map = get(this, 'mapObject.map');
            const flash = get(this, 'flashMessage');
            set(model, 'center_lat', map.getCenter().lat);
            set(model, 'center_lng', map.getCenter().lng);
            set(model, 'zoom_level', map.getZoom());

            model.save().then(() => {
                flash.setProperties({
                    message: 'CENTER AND ZOOM LEVEL SET',
                    show: true,
                    success: true
                });
                run.later(this, () => {
                    flash.setProperties({ message: '', show: false });
                }, 3000);
            }, () => {
                // Error callback
                flash.setProperties({
                    message: 'FAILED TO SET CENTER AND ZOOM LEVEL',
                    show: true,
                    success: false
                });
                run.later(this, () => {
                    flash.setProperties({ message: '', show: false });
                }, 3000);
                model.rollbackAttributes();
            });
        },

        setBase(base, model) {
            const map = get(this, 'mapObject.map');
            const baseMaps = get(this, 'mapObject.baseMaps');
            const flash = get(this, 'flashMessage');

            Object.values(baseMaps).forEach((layer) => {
                map.removeLayer(layer);
            });
            baseMaps[base].addTo(map);
            model.setProperties({ default_base_map: base });
            if (model.editing) {
                model.save().then(() => {
                    // Success callback
                    // Show confirmation.
                    flash.setProperties({
                        message: 'BASE MAP SET',
                        show: true,
                        success: true
                    });
                    run.later(this, () => {
                        flash.setProperties({ message: '', show: false });
                    }, 3000);
                }, () => {
                    // Error callback
                    flash.setProperties({
                        message: 'ERROR BASE MAP NOT SET',
                        show: true,
                        success: false
                    });
                    run.later(this, () => {
                        flash.setProperties({ message: '', show: false });
                    }, 3000);
                    model.rollbackAttributes();
                });
            }
        }
    }
});
