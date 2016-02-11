import Ember from 'ember';

export default Ember.Controller.extend({
    needs: "project",

    // introSeen: Ember.computed.alias("controllers.project.introSeen")

    introSeen: function(){
        return false;
    }.property('introSeen'),
});
