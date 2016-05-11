import Ember from 'ember';

export default Ember.Route.extend({
    dataColors: Ember.inject.service('data-colors'),

    model(){
        return this.store.query('raster_layer_project', {project_id: 24});
    },

    actions: {
        reorder( /*layer, position*/ ) {
            // layer.forEach(function(item, index){
            //     console.log(item)
            //     console.log(index)
            // })
            // let _this = this;
            // let layerToUpdate = this.store.peekRecord('raster-layer-project', layer);
            // layerToUpdate.set('position', position);
            // layerToUpdate.save().then(function(){
            //     // success
            //     _this.set('editSuccess', true);
            //     Ember.run.later(this, function(){
            //         _this.set('editSuccess', false);
            //     }, 3000);
            // }, function(){
            //     _this.set('editFail', true);
            //     Ember.run.later(this, function(){
            //         _this.set('editFail', false);
            //     }, 3000);
            //
            // });
        },
        dragStarted(item) {
            console.log(`Item started dragging: ${item.get('id')}`);
        },
        dragStopped(item) {
            console.log(`Item stopped dragging: ${item.get('id')}`);
        }
    }
});
