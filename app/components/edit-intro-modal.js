import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['intro-modal-link'],

    isShowingEditModal: false,

    didRender: function(){
        // http://alex-d.github.io/Trumbowyg/documentation.html
        Ember.$('#edit-project-intro').trumbowyg({
            fullscreenable: false,
            removeformatPasted: true
        });

    },

    didInsertElement: function(){
        switch (this.get('project.templateSlug')){
            case 'article-and-video':
                this.set('av', true);
                break;
            case 'article-only':
                this.set('a', true);
                break;
            case 'video-only':
                this.set('v', true);
                break;
        }
    },

    actions: {

        openEditModal: function() {
            this.setProperties({isShowingEditModal: true});
        },
        closeEditModal: function() {
            this.setProperties({isShowingEditModal: false});
        },

        setTemplate: function(template) {
            var pickedTemplate = '';
            this.set('a', false);
            this.set('av', false);
            this.set('v', false);
            switch(template){
                case 'av':
                    pickedTemplate = 1;
                    this.set('av', true);
                    this.set('a', false);
                    this.set('v', false);
                    break;
                case 'a':
                    pickedTemplate = 2;
                    this.set('a', true);
                    this.set('v', false);
                    this.set('av', false);
                    break;
                case 'v':
                    pickedTemplate = 3;
                    this.set('v', true);
                    this.set('a', false);
                    this.set('av', false);
                    break;
            }
            var project = this.get('project');
            project.set('template_id', pickedTemplate);
            project.save();
        },

        changeTemplate: function(){
            var project = this.get('project');
            project.set('template_id', '');
        },

        updateIntro: function(){
            var project = this.get('project');
            project.set('intro', Ember.$('textarea#edit-project-intro').val());
            // this.sendAction('update', project);
            project.save().then(function() {
                // Success callback
                // Show confirmation.
                Ember.$(".edit-intro-success").slideToggle().delay(2500).slideToggle();
                }, function() {
                    // Error callback
                    Ember.$(".edit-intro-fail").stop().slideToggle().delay(3000).slideToggle();
                    project.rollbackAttributes();

            });
        },

        cancelIntroUpdate: function(){
            this.send('closeEditModal');
            this.sendAction('cancel', this.get('project'));
        }

    }
});
