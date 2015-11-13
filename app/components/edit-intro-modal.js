import Ember from 'ember';

export default Ember.Component.extend({
    isShowingEditModal: true,

    actions: {
        openEditModal: function() {
            this.setProperties({isShowingEditModal: true});
        },
        closeEditModal: function() {
            this.setProperties({isShowingEditModal: false});
        },

        setTemplate: function(template) {
            var pickedTemplate = '';
            switch(template){
                case 'av':
                    pickedTemplate = 1;
                    break;
                case 'a':
                    pickedTemplate = 2;
                    break;
                case 'v':
                    pickedTemplate = 3;
                    break;
            }
            var model = this.get('project');
            model.set('template_id', pickedTemplate);
            model.save();
        }
    }
});
