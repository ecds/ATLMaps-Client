import Ember from 'ember';

export default Ember.Controller.extend({

    isEditing: false,

    editSuccess: false,

    editFail: false,

    showBrowse: false,

    rastersActive: false,

    showingAllLayers: true,

    actions: {
        toggleEdit: function(){
            this.toggleProperty('isEditing');
        }
    }
});
