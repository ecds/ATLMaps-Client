import Ember from 'ember';
/* global Cookies */

export default Ember.Component.extend({
    classNames: ['intro-modal-link'],

    isShowingIntroModal: true,

    notShowingIntro: false,

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

    },

    actions: {

        hideIntro: function() {
            this.setProperties({isShowingIntroModal: false});
        },

        showIntro: function() {
            this.setProperties({isShowingIntroModal: true});
        },

        supressIntro: function(){
            var projectID = this.get('project.id');

            if (document.getElementById('dont-show').checked === true){
                console.log('setting cookie to true');
                Cookies.set('noIntro' + projectID, true);
            }
            else {
                console.log('removing cookie');
                Cookies.remove('noIntro' + projectID);
            }
        },

    }
});
