import Ember from 'ember';
/* global Sortable */

export default Ember.Component.extend({
	/*
	We use a good bit of jQuery here because we're getting various attributes
	out of the element and querying the DOM because order matters a lot here.
	*/

	didInsertElement: function(){
		var el = document.getElementById("layer_sort");
		var _this = this;
		Sortable.create(el, {
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
					Ember.$("."+layer.id).css("zIndex", position + 10);
					if(_this.get('isEditing') === true){
						// Send the new position up to the route's action.
						_this.sendAction('reorder', Ember.$(layer).attr("data-id"), position);
					}
				});
			}
		});
	}
});
