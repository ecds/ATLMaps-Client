import Ember from 'ember';

export default Ember.Component.extend({

	//actions: {
		foo: function() {
			Ember.run.scheduleOnce('afterRender', function() {
				console.log('grrrrr');
			});
		}.on('didInsertElement')
	//}
});
