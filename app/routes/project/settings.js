import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
    Route,
    get,
    run,
    inject: {
        service
    }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
    mapObject: service(),
    flashMessage: service(),

    actions: {
        setBase(base, model) {
            const map = get(this, 'mapObject.map');
            const baseMaps = get(this, 'mapObject.baseMaps');
            const flash = get(this, 'flashMessage');

            Object.values(baseMaps).forEach((layer) => {
                map.removeLayer(layer);
            });
            baseMaps[base].addTo(map);
            model.setProperties({ default_base_map: base });
            if (get(model, 'may_edit')) {
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
