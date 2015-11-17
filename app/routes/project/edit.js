import Ember from 'ember';

export default Ember.Route.extend({


	actions: {

        // didTransition: function(){
        //     var map = this.globals.mapObject;
        //     map.redraw();
        // },

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
                    model.rollbackAttributes();

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

        },

        setBaseMap: function() {
            var base = Ember.$('input[name=leaflet-base-layers]:checked').next().html().trim().toLowerCase();
        }

        // The action for updateing the order of raster layers is in the
        // `reorder-layer` component. It was put there so we could reuse
        // it on the explore route.

        // The action for setting the base map is in the `select-base-layer`
        // component. It was put there so we could reuse it on the explore route.
	}
});
