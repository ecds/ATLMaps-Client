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

    actions: {
        searchBounds() {
            this.toggleProperty('hasBounds');
            if (get(this, 'hasBounds')) {
                let map = get(this, 'mapObject.map');
                // try {
                //     bounds.getWest();
                let currentBounds = map.getBounds();
                set(this, 'browseParams.bounds', {
                    s: currentBounds.getSouth(),
                    n: currentBounds.getNorth(),
                    e: currentBounds.getEast(),
                    w: currentBounds.getWest()
                });
            } else {
                set(this, 'browseParams.bounds', {});
            }
            this.sendAction('getResults');
        }
    }
});
