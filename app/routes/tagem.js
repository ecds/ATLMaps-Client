import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        return Ember.RSVP.hash({
            // rasters: this.store.findAll('raster-layer'),
            // vectors: this.store.findAll('vector-layer'),
            categories: this.store.findAll('category'),
        });
    },
});
