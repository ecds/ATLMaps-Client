import Ember from 'ember';

export default Ember.Route.extend({

	// model(){
    //     return Ember.RSVP.hash({
	// 		project: this.store.find('project', 24),
	// 		rasterMeta: this.store.query('raster_layer_project',{project_id: 24})
	// 	});
	// },
	//
	// setupController(controller, models){
    //     controller.set('project', models.project);
    //     controller.set('rasterMeta', models.rasterMeta);
    // },

	actions: {

    	didTransition: function() {
    		Ember.$(document).attr('title', 'ATLMaps: About');
    	}
    }
});
