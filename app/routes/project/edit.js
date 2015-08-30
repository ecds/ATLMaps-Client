import Ember from 'ember';

export default Ember.Route.extend({


	actions: {

		updateProjectInfo: function(model) {
            model.save();
            Ember.$(".edit-info-success").slideToggle().delay(2500).slideToggle();
        },

        cancelUpdate: function(model) {
            //this.toggleProperty('isEditing');
            model.rollbackAttributes();
        },

        updateOrder: function(layers, layerCount) {
			console.log(layers);
			console.log(layerCount);
            var _this = this;
            Ember.$.each(layers, function(index, value){
                var position = layerCount - index;
                console.log(value+" => "+position);

                _this.store.find('raster_layer_project', {
                    project_id: 24,
                    raster_layer_id: value
                }).then(function(rasterLayerProject){
                    var  newPosition = rasterLayerProject.get('firstObject');
                    newPosition.set('position', position);
                    newPosition.save();
                });
            });
            Ember.$(".reorder-success").stop().slideToggle().delay(1500).slideToggle();
        },

        setCenterAndZoom: function(){
            var map = this.globals.mapObject;

            var project = this.modelFor('project');

            project.set('center_lat', map.getCenter().lat);
            project.set('center_lng', map.getCenter().lng);
            project.set('zoom_level', map.getZoom());
            project.save();

            Ember.$(".reorder-success").stop().slideToggle().delay(1500).slideToggle();
        }
	}
});
