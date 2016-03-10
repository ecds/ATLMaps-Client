import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        reorder(layer, position){
            let _this = this;
            let layerToUpdate = this.store.peekRecord('raster-layer-project', layer);
            layerToUpdate.set('position', position);
            layerToUpdate.save().then(function(){
                // success
                _this.set('editSuccess', true);
                Ember.run.later(this, function(){
                    _this.set('editSuccess', false);
                }, 3000);
            }, function(){
                _this.set('editFail', true);
                Ember.run.later(this, function(){
                    _this.set('editFail', false);
                }, 3000);

            });
        }
    }
});
