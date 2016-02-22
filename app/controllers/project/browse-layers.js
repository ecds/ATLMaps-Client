import Ember from 'ember';

export default Ember.Controller.extend({
    needs: "project",

    isEditing: Ember.computed.alias("controllers.project.isEditing"),
    showBrowse: Ember.computed.alias("controllers.project.showBrowse")
});
