import Ember from 'ember';

export default Ember.Component.extend({
    showIntro: Ember.inject.service(),
    classNames: ['intro-modal-link'],

    didInsertElement: function(){

        // Pick the layout from the attribute
        if (this.get('project.templateSlug') === 'article-and-video'){
			this.set('av', true);
		}
        else if (this.get('project.templateSlug') === 'article-only'){
            this.set('a', true);
        }
        else if (this.get('project.templateSlug') === 'video-only'){
            this.set('v', true);
        }

    },

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
