import Ember from 'ember';

export default Ember.Route.extend({
    update: function(){
        console.log(this.modelFor('project').didUpdate);
    }
});
