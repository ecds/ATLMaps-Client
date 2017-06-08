import Ember from 'ember';
/* globals L */

const {
    Component,
    get,
    run,
    inject: {
        service
    }
} = Ember;

export default Component.extend({
    mapObject: service(),
    flashMessage: service(),
    zoomLevels: [...Array(19).keys()].reverse(),
    classNames: ['set-center-zoom'],

    actions: {
        updateCenter() {
            const project = get(this, 'project');
            get(this, 'mapObject.map').flyTo(
                L.latLng(
                    project.get('center_lat'),
                    project.get('center_lng')
                ), project.get('zoom_level')
            );
        },

        updateZoomLevel(level) {
            get(this, 'project').setProperties({ zoom_level: level });
            get(this, 'mapObject.map').setZoom(level);
        },

        saveCenterZoom() {
            const flash = get(this, 'flashMessage');
            const project = get(this, 'project');
            project.save().then(() => {
                // Success callback
                // Show confirmation.
                flash.setProperties({
                    message: 'CENTER/ZOOM SET',
                    show: true,
                    success: true
                });
                run.later(this, () => {
                    flash.setProperties({ message: '', show: false });
                }, 3000);
            }, () => {
                // Error callback
                flash.setProperties({
                    message: 'ERROR CENTER/ZOOM NOT SET :(',
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

});
