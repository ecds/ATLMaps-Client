import Ember from 'ember';

export default Ember.Route.extend({


	actions: {

		updateProjectInfo: function(model) {
            /* Action that updates the title, description and
            published status of a project. */
            model.save().then(function() {
                // Success callback
                // Show confirmation.
                Ember.$(".edit-info-success").slideToggle().delay(2500).slideToggle();
                }, function() {
                    // Error callback
                    Ember.$(".edit-info-fail").stop().slideToggle().delay(3000).slideToggle();

            });
        },

        cancelUpdate: function(model) {
            /* Action that rolls back any updates that have changed
            in the local store but haven't been pushed to the API. */
            model.rollbackAttributes();
        },

        setCenterAndZoom: function(){
            var map = this.globals.mapObject;

            var project = this.modelFor('project');

            
            project.set('center_lat', map.getCenter().lat);
            project.set('center_lng', map.getCenter().lng);
            project.set('zoom_level', map.getZoom());
            project.save().then(function() {
                // Success callback
                // Show confirmation.
                Ember.$(".recenter-success").stop().slideToggle().delay(1500).slideToggle();
                }, function() {
                    // Error callback
                    Ember.$(".recenter-fail").stop().slideToggle().delay(3000).slideToggle();

            });

        }

        // The action for updateing the order of raster layers is in the 
        // `reorder-layers` component.
	}
});
