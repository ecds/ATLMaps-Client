import Ember from 'ember';

export default Ember.Controller.extend({

    projectController: Ember.inject.controller('project'),
    
    isEditing: Ember.computed.reads('projectController.isEditing'),

    editSuccess: Ember.computed.reads('projectController.editSuccess'),

    editFail: Ember.computed.reads('projectController.editFail'),

    introSeen: function(){
        return false;
    }.property('introSeen'),
});
