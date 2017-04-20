import Ember from 'ember';

const {
    Component,
    get,
    inject: { service },
    set
} = Ember;

export default Component.extend({
    mapObject: service(),
    browseParams: service(),
    classNames: ['search-bounds'],
    hasBounds: false,
    moved: false,

    setBounds() {
        const map = get(this, 'mapObject.map');
        const currentBounds = map.getBounds();
        set(this, 'browseParams.bounds', {
            s: currentBounds.getSouth(),
            n: currentBounds.getNorth(),
            e: currentBounds.getEast(),
            w: currentBounds.getWest()
        });

        set(this, 'moved', false);
        this.sendAction('getResults');
    },

    actions: {
        searchBounds() {
            this.toggleProperty('hasBounds');
            const map = get(this, 'mapObject.map');
            if (get(this, 'hasBounds')) {
                map.on('move', () => {
                    set(this, 'moved', true);
                });
                this.setBounds();
            } else {
                set(this, 'browseParams.bounds', {});
                map.off('move');
                set(this, 'moved', false);
            }
            this.sendAction('getResults');
        },

        updateBounds() {
            this.setBounds();
        }
    }
});
