import Ember from 'ember';

export function initialize(/* container, application */) {
	Ember.Route.reopen({
		activate: function() {
			var cssClass = this.toCssClass();
			// you probably don't need the application class
			// to be added to the body
			if (cssClass !== 'application') {
				Ember.$('body').addClass(cssClass);
			}
		},
		
		deactivate: function() {
			Ember.$('body').removeClass(this.toCssClass());
		},
		
		toCssClass: function() {
			return this.routeName.replace(/\./g, '-').dasherize();
		}
	});
}

export default {
  name: 'body-class',
  initialize: initialize
};
