import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
    actions: {
        didTransition: function(){
            console.log(this.controllerFor('project').get('introSeen'));
        }
    }
});
