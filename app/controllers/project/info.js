import Ember from 'ember';

export default Ember.Controller.extend({

    projectController: Ember.inject.controller('project'),

    isEditing: Ember.computed.reads('projectController.isEditing'),

    editSuccess: Ember.computed.reads('projectController.editSuccess'),

    editFail: Ember.computed.reads('projectController.editFail'),

    // Property is set when a visitor has seen the intro modal. Otherwise
    // the modal would pop up everytime she navigated back to the `info` route.
    introSeen: function(){
        return false;
    }.property('introSeen'),
});
