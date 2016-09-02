import Ember from 'ember';

const {
    Route,
    get,
    inject: {
        service
    },
    set
} = Ember;

export default Route.extend({
    mapObject: service(),

    actions: {
        reorderItems(groupModel, itemModels /*draggedModel*/) {
            let _this = this;
            set(groupModel, 'raster_layer_project_ids', itemModels);
            get(groupModel, 'raster_layer_project_ids').forEach(function(item, index) {

                // So here we are taking the length of the array, subtracting
                // the index of the layer and then adding 10 to reorder them.
                // It's just that easy.
                let newPosition = itemModels.length - index + 10;

                item.setProperties({ position: newPosition });

                let rasterSlug = item.get('raster_layer_id.slug');
                _this.get('mapObject.projectLayers')[rasterSlug].setZIndex(newPosition);

                if (groupModel.get('editing') === true) {
                    item.save();
                }

            });
        }
    }
});
