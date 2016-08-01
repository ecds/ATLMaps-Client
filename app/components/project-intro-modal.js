import Ember from 'ember';
import { EKMixin, keyUp } from 'ember-keyboard';

export default Ember.Component.extend(EKMixin,{
    showIntro: Ember.inject.service(),
    classNames: ['intro-modal-link'],

    activateKeyboard: Ember.on('init', function() {
        this.set('keyboardActivated', true);
    }),

    didInsertElement: function(){

        // // Pick the layout from the attribute
        // if (this.get('project.templateSlug') === 'article-and-video'){
        //     this.set('av', true);
        // }
        // else if (this.get('project.templateSlug') === 'article-only'){
        //     this.set('a', true);
        // }
        // else if (this.get('project.templateSlug') === 'video-only'){
        //     this.set('v', true);
        // }

    },

    closeWithEsc: Ember.on(keyUp('Escape'), function() {
        this.sendAction('action');
    }),

    actions: {

        toggleIntro: function() {
            this.sendAction('action');
        },

        supressIntro: function(){
            var projectID = this.get('project.id');

            this.get('showIntro').setCookie(projectID);
        },

    }
});
