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

    actions: {
        searchBounds() {
            console.log('bounds?????', get(this, 'browseParams.bounds'));
            // Clear bounds
            if (get(this, 'browseParams.bounds') !== null) {
                set(this, 'browseParams.bounds', null);
                this.sendAction('getResults');
            } else {
                let map = get(this, 'mapObject.map');
                let bounds = map.getBounds();
                set(this, 'browseParams.bounds', {
                    s: bounds.getSouth(),
                    n: bounds.getNorth(),
                    e: bounds.getEast(),
                    w: bounds.getWest()
                });
                this.sendAction('getResults');
            }
        }
    }
});
