import Ember from 'ember';

export default Ember.Route.extend({
    mapObject: Ember.inject.service('map-object'),

    actions: {
        setCenterAndZoom: function(model){
            let map = this.get('mapObject.map');
            var projectController = this.controllerFor('project');
            var controller = this.controllerFor('project.base-layers');

            model.set('center_lat', map.getCenter().lat);
            model.set('center_lng', map.getCenter().lng);
            model.set('zoom_level', map.getZoom());

            model.save().then(function() {
                // Success callback
                // Show confirmation.
                controller.set('successMessage', 'Center and zoom level set!');
                projectController.set('editSuccess', true);
                Ember.run.later(this, function(){
                    projectController.set('editSuccess', false);
                }, 3000);
                }, function() {
                    // Error callback
                    controller.set('failMessage', 'Dang, center and zoom level not set.');
                    projectController.set('editFail', true);
                    Ember.run.later(this, function(){
                        projectController.set('editFail', false);
                    }, 3000);
                    model.rollbackAttributes();

            });

        },

		setBase: function(base, model) {
            alert(base)
			Ember.$(".leaflet-control-layers-selector").removeAttr('checked');
			Ember.$("span:contains(' "+ base + "')").prev().click().attr('checked', 'checked');
            var projectController = this.controllerFor('project');
            var controller = this.controllerFor('project.base-layers');
			model.set('default_base_map', base);
            model.save().then(function() {
                // Success callback
                // Show confirmation.
                controller.set('successMessage', 'Base layer has been set!');
                projectController.set('editSuccess', true);
                Ember.run.later(this, function(){
                    projectController.set('editSuccess', false);
                }, 3000);
                }, function() {
                    // Error callback
                    controller.set('failMessage', 'Dang, base map was not set.');
                    projectController.set('editFail', true);
                    Ember.run.later(this, function(){
                        projectController.set('editFail', false);
                    }, 3000);
                    model.rollbackAttributes();

            });
		}


    }
});
