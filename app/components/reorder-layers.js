import Ember from 'ember';
/* global Sortable */

export default Ember.Component.extend({

	edit: false,

	didInsertElement: function(){
		if (this.get('mode') === 'edit'){
			this.set('edit', true);
		}
		var el = document.getElementById("layer_sort");
		var _this = this;
        Sortable.create(el, {
            handle: '.handle',
            animation: 150,
            ghostClass: "sorting",
            onUpdate: function () {
                var IDs = [];
                var layerIDs = [];
                // Get the raster layers in the project by the id.
                Ember.$(".raster-list").find(".raster-layer").each(function(){
                    IDs.push(this.id);
                });
                var layerLength = IDs.length;
                Ember.$.each(IDs, function(index, value){
                    // So here we are taking the length of the array, subtracting
                    // the index of the layer and then adding 10 to reorder them.
                    // It's just that easy.
                    var zIndex = layerLength - index + 10;
                    Ember.$("."+value).css("zIndex", zIndex);

                });
                if (_this.get('edit') === true) {
                    Ember.$(".raster-list").find(".raster-layer").each(function(){
                        layerIDs.push(Ember.$(this).attr("layer-id"));
                    });

                    _this.send('updateOrder', layerIDs, layerIDs.length, _this.get('model'));
                }
            }
        });
	},

	actions: {
		updateOrder: function(layers, layerCount, model) {
            var _this = this;
			// Go through each layer and update the new positon.
            Ember.$.each(layers, function(index, value){
                var position = layerCount - index;

                _this.store.query('raster_layer_project', {
                    project_id: model.get('id'),
                    raster_layer_id: value
                }).then(function(rasterLayerProject){
                    var  layerToUpdate = rasterLayerProject.get('firstObject');
                    layerToUpdate.set('position', position);
                    layerToUpdate.save();
                });
            });
			// This is less than ideal but we were getting getting errors on the
			// `save().the()`function even though the save was successful.
			Ember.$(".reorder-success").stop().slideToggle().delay(1500).slideToggle();
        }
	}
});
