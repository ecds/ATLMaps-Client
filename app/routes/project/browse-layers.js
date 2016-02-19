import Ember from 'ember';

export default Ember.Route.extend({
    classNames: ['bwowse-layers-route'],

    actions: {

    	didTransition: function() {
            this.controllerFor('project').set('showBrowse', true);
        }
    }
});
