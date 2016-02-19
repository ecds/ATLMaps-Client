import Ember from 'ember';

export default Ember.Controller.extend({
    projectController: Ember.inject.controller('project'),

    isEditing: Ember.computed.reads('projectController.isEditing'),

    editSuccess: Ember.computed.reads('projectController.editSuccess'),

    editFail: Ember.computed.reads('projectController.editFail'),

    successMessage: 'I <3 burritos!',

    failMessage: "I don't like eggplan.",

});
