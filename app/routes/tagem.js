import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        return Ember.RSVP.hash({
            // rasters: this.store.findAll('raster-layer'),
            // vectors: this.store.findAll('vector-layer'),
            categories: this.store.findAll('category'),
            layer: this.store.queryRecord('raster-layer', {tagem: true})
        });
    },

    actions: {
        addTag(tagID) {

            // console.log('oh')
            let tag = this.store.peekRecord('tag', tagID);
            let layer = this.currentModel.layer;

            layer.get('tag_ids').pushObject(tag);
            layer.save();
        },

        didTransition(){
            // console.log(this.currentModel.layer.get('tag_ids'))
        }
    }
});
