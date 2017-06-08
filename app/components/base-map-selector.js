import Ember from 'ember';

const {
    Component,
    get,
    run,
    inject: {
        service
    }
} = Ember;

export default Component.extend({
    // classNames: ['base-map-selector'],
    mapObject: service(),
    flashMessage: service(),

    actions: {
        setBase(base) {
            const map = get(this, 'mapObject.map');
            const baseMaps = get(this, 'mapObject.baseMaps');
            const flash = get(this, 'flashMessage');
            const project = get(this, 'project');

            Object.values(baseMaps).forEach((layer) => {
                map.removeLayer(layer);
            });
            baseMaps[base].addTo(map);
            if (project) {
                project.setProperties({ default_base_map: base });
                if (get(project, 'may_edit')) {
                    project.save().then(() => {
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
                        project.rollbackAttributes();
                    });
                }
            }
        }
    }
});
