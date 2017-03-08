/* eslint no-mixed-operators: ["error", {"allowSamePrecedence": true}] */
import Ember from 'ember';

const {
    Route,
    get,
    inject: {
        service
    },
    run,
    set
} = Ember;

export default Route.extend({
    mapObject: service(),
    flashMessage: service(),

    actions: {
        // The sortable action is initilized in the template using
        // the ember-sortable addon.
        reorderItems(groupModel, itemModels /* draggedModel */) {
            const _this = this;
            set(groupModel, 'project.raster_layer_project_ids', itemModels);
            get(groupModel, 'project.raster_layer_project_ids').forEach((item, index) => {
                // So here we are taking the length of the array, subtracting
                // the index of the layer and then adding 10 to reorder them.
                // It's just that easy.
                const newPosition = itemModels.length - index + 10;

                item.setProperties({ position: newPosition });

                const rasterSlug = item.get('raster_layer_id.slug');
                _this.get('mapObject.projectLayers.rasters')[rasterSlug].setZIndex(newPosition);
                // TODO if may edit, provide way to save order in not in edit mode
                // TODO provide feedback on save
                if (groupModel.project.get('may_edit') === true) {
                    item.save().then(() => {
                        set(_this, 'flashMessage.message', 'Order Updated!');
                        set(_this, 'flashMessage.success', true);
                        set(_this, 'flashMessage.show', true);
                        run.later(this, () => {
                            set(_this, 'flashMessage.message', '');
                            set(_this, 'flashMessage.show', false);
                            set(_this, 'flashMessage.success', true);
                            // _this.toggleProperty('flashMessage.showing');
                        }, 3000);
                    }, () => {
                        // TODO figure out how to give feedback on these shared actions
                        set(_this, 'flashMessage.message', 'Oh no! Someting went wrong <i class="material-icons">sentiment_dissatisfied</i>');
                        set(_this, 'flashMessage.show', true);
                        set(_this, 'flashMessage.success', false);

                        run.later(this, () => {
                            set(_this, 'flashMessage.message', '');
                            set(_this, 'flashMessage.show', false);
                        }, 3000);
                    });
                }
            });
        }
    }
});
