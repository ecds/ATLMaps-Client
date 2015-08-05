import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return this.store.createRecord('project', {
                name: 'Exploring',
                user_id: 0,
                published: false,
                is_mine: true,
                may_edit: true
            });
	},

	actions: {

    	didTransition: function() {
    		var _this = this;
    		Ember.run.scheduleOnce('afterRender', function() {
                _this.send('initProjectUI', _this.modelFor('explore'));
            });
    	}
    }
});
