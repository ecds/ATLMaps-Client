import Ember from 'ember';
/* global Cookies */

export default Ember.Component.extend({
    isShowingIntroModal: true,

    notShowingIntro: false,

    // A function to create a listiner for clicking
    // the don't show intro model checkbox.
    clickListen: function(){
        var projectID = this.get('project.id');

        // Sigh...don't like using the `run.later`
        Ember.run.later(this, function() {
            Ember.$('#dont-show').click(function(){
                if(this.checked) {
                    Cookies.set('noIntro' + projectID, true);
                }
                else{
                    Cookies.remove('noIntro' + projectID);
                }
            });
        }, 200);
    },

    didInsertElement: function(){
        var projectID = this.get('project.id');

        if (Cookies.get('noIntro' + projectID)) {
            this.setProperties({isShowingIntroModal: false});
            this.setProperties({notShowingIntro: true});
        }
        else {
            this.setProperties({isShowingIntroModal: true});
            this.setProperties({notShowingIntro: false});
        }

        if (this.get('template') === 'article-and-video'){
			this.set('av', true);
		}
        else if (this.get('template') === 'article-only'){
            this.set('a', true);
        }
        else if (this.get('template') === 'video-only'){
            this.set('v', true);
        }

        this.clickListen();

    },

    actions: {

        hideIntro: function() {
            this.clickListen();
            this.setProperties({isShowingIntroModal: false});
        },

        showIntro: function() {
            this.clickListen();
            this.setProperties({isShowingIntroModal: true});
        },

    }
});
