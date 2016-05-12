import Ember from 'ember';

export default Ember.Route.extend({
    mapObject: Ember.inject.service('map-object'),

    actions: {
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

                if(groupModel.get('editing') === true){
                    item.save();
                } else {}

            });
        }
    }
});
