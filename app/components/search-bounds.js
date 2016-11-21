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
            // let bounds = get(this, 'browseParams.bounds');
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
            // }
            // catch(err) {
            //     console.log('err', err);
            //     set(this, 'browseParams.bounds', {});
            //     let newbounds = get(this, 'browseParams.bounds');
            //     console.log('newbounds', newbounds);
            // }
            // if (typeof bounds.getWest() !== 'function') {
            //     set(this, 'browseParams.bounds', null);
            //     this.sendAction('getResults');
            // } else {
            //     let map = get(this, 'mapObject.map');
            //     let bounds = map.getBounds();
            //     console.log('bounds', bounds);
            //     set(this, 'browseParams.bounds', {
            //         s: bounds.getSouth(),
            //         n: bounds.getNorth(),
            //         e: bounds.getEast(),
            //         w: bounds.getWest()
            //     });
            //     console.log('bounds now?', get(this, 'browseParams.bounds'));
            this.sendAction('getResults');
            // }
        }
    }
});
