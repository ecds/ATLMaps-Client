import Ember from 'ember';

export default Ember.Route.extend({
    mapObject: Ember.inject.service('map-object'),

    // model(){
    //     return this.store.query('raster_layer_project', {project_id: 24});
    // },

    actions: {
        // reorder( layer, position ) {
        //     console.log(layer)
        //     console.log(position)
        //     debugger;
        //     // layer.forEach(function(item, index){
        //     //     console.log(item)
        //     //     console.log(index)
        //     // })
        //     // let _this = this;
        //     // let layerToUpdate = this.store.peekRecord('raster-layer-project', layer);
        //     // layerToUpdate.set('position', position);
        //     // layerToUpdate.save().then(function(){
        //     //     // success
        //     //     _this.set('editSuccess', true);
        //     //     Ember.run.later(this, function(){
        //     //         _this.set('editSuccess', false);
        //     //     }, 3000);
        //     // }, function(){
        //     //     _this.set('editFail', true);
        //     //     Ember.run.later(this, function(){
        //     //         _this.set('editFail', false);
        //     //     }, 3000);
        //     //
        //     // });
        // },
        reorderItems(groupModel, itemModels /*draggedModel*/) {
            let _this = this;
            groupModel.set('raster_layer_project_ids', itemModels);
            groupModel.get('raster_layer_project_ids').forEach(function(item, index){

                // So here we are taking the length of the array, subtracting
                // the index of the layer and then adding 10 to reorder them.
                // It's just that easy.
                let newPosition = itemModels.length - index + 10;


                item.setProperties({position: newPosition});

                let rasterSlug = item.get('raster_layer_id.slug');
                _this.get('mapObject.rasterLayers')[rasterSlug].setZIndex(newPosition);

                if(_this.get('isEditing') === true){
                    item.save();
                } else {
                    console.log('not editing');
                }

            });
        },
        dragStarted(item) {
            console.log(`Item started dragging: ${item.get('id')}`);
        },
        dragStopped(item) {
            console.log(`Item stopped dragging: ${item.get('id')}`);
        }
    }
});
