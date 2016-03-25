import Ember from 'ember';

export default Ember.Controller.extend({

    //TODO: is this true?
    needs: "project",

    isEditing: Ember.computed.alias("controllers.project.isEditing"),

    dataColors: Ember.inject.service('data-colors')
});
