import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		// Why 9999999? Good question. For the `explore` route to
		// associate the correct colors with the marker, we have to give
		// we have to create the dummy project with an ID. In the route
		// `explore.js` we assing it 9999999. All the 9s make me think of
		// Herman Cain:
		// http://www.funnyordie.com/videos/4ecfd3a85f/herman-cains-campaign-promises-with-mike-tyson
		return this.store.createRecord('project', {
                name: 'Exploring',
                user_id: 0,
                published: false,
                is_mine: true,
                may_edit: true,
				default_base_map: 'street',
				id: 9999999
            });
	},

	actions: {

    	didTransition: function() {
    		var _this = this;
    		Ember.run.scheduleOnce('afterRender', function() {
                _this.send('initProjectUI', _this.modelFor('explore'));
            });
    	},

    }
});
