import Ember from 'ember';
/* global Sortable */

export default Ember.Component.extend({
	/*
	We use a good bit of jQuery here because we're getting various attributes
	out of the element and querying the DOM because order matters a lot here.
	*/

	mapObject: Ember.inject.service('map-object'),

	didInsertElement: function(){
		let el = document.getElementById("layer_sort");
		let _this = this;
		let layerObjs = this.get('mapObject.rasterLayers')
		let sortable = Sortable.create(el, {
			handle: '.handle',
			animation: 150,
			ghostClass: "sorting",
			onUpdate: function () {
				var layers = [];
				// Get the raster layers in the project by the id.
				Ember.$(".raster-list").find(".raster-layer").each(function(){
					layers.push(this);
				});
				var layerLength = layers.length;
				layers.forEach(function(layer, index){
					// So here we are taking the length of the array, subtracting
					// the index of the layer and then adding 10 to reorder them.
					// It's just that easy.
					var position = layerLength - index;

					_this.get('mapObject.rasterLayers')[layer.id].setZIndex(position + 10);

					// let updatedLayerObj = _this.get('mapObject.rasterLayers')[layer.get('slug')].setOpacity(opacity);
					// _this.get('mapObject').updateLayerObjects(layer.get('slug'), updatedLayerObj);

					if(_this.get('isEditing') === true){
						// Send the new position up to the route's action.
						_this.sendAction('reorder', Ember.$(layer).attr("data-id"), position);
					}
				});
			}
		});

		Ember.set(this, 'sortable', sortable);
	},

	willDestroyElement(){
		this.get('sortable').destroy();
	}
});
