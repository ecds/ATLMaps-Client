import Ember from 'ember';

const {
    Component,
    get,
    set,
    inject: {
        service
    },
    run
} = Ember;

export default Component.extend({
    flashMessage: service(),
    dataColors: service(),
    mapObject: service(),
    tagName: '',

    shareUrlId: '',
    embedCodeId: '',
    height: 600,
    width: 800,
    embedParams: {
        color: 'red',
        base: 'greyscale'
    },
    selectedColor: null,

    didInsertElement() {
        const layer = get(this, 'layer');
        // Run once after reender to make sure we have the base maps.
        run.scheduleOnce('afterRender', () => {
            this.setProperties(
                {
                    shareUrlId: `${get(layer, 'slug')}_sharable`,
                    embedCodeId: `${get(layer, 'slug')}_embedable`,
                    selectedColor: get(this, 'dataColors.safeEmbedColors')[0],
                    baseMaps: Object.keys(get(this, 'mapObject.baseMaps')),
                    showColorPicker: get(this, 'layer.data_format') === 'vector'
                }
            );
        });
    },

    actions: {

        setColor(color) {
            set(this, 'embedParams.color', color.name);
            set(this, 'selectedColor', color);
        },

        success(type) {
            const flash = get(this, 'flashMessage');
            flash.setProperties({
                message: `${type} COPIED TO CLIPBOARD`,
                show: true,
                success: true
            });
            run.later(this, () => {
                flash.setProperties({ message: '', show: false });
            }, 3000);
        },

        error() {
            const flash = get(this, 'flashMessage');
            flash.setProperties({
                message: 'FAILED TO COPY',
                show: true,
                success: false
            });
            run.later(this, () => {
                flash.setProperties({ show: false });
            }, 300);
        }
    }
});
