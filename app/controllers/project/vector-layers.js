import Ember from 'ember';

export default Ember.Controller.extend({

    projectController: Ember.inject.controller('project'),

    isEditing: Ember.computed.reads('projectController.isEditing'),

    dataColors: Ember.inject.service('data-colors')
});
