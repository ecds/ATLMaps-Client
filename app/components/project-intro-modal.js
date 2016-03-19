import Ember from 'ember';
/* global Cookies */

export default Ember.Component.extend({
    classNames: ['intro-modal-link'],

    // Property for to supres intro if user as said they don't want to see it.
    surpressed: false,

    didInitAttrs: function(){
        var projectID = this.get('project.id');

        // Check for cookie that user does not want to see intro.
        if (Cookies.get('noIntro' + projectID)) {
            this.sendAction('action', true);
            // We need to upldate the local property as it does not get passed
            // back in on change
            this.set('seen', true);
            this.setProperties({surpressed: true});
        }

        // Pick the layout from the attribute
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
            // Again, the property that was passed in does not update
            this.set('seen', true);
            this.sendAction('action', true);
        },

        showIntro: function() {
            this.set('seen', false);
            this.sendAction('action', false);
        },

        // Add/remmove cookie for showing the intro for a project.
        supressIntro: function(){
            var projectID = this.get('project.id');

            if (document.getElementById('dont-show').checked === true){
                Cookies.set('noIntro' + projectID, true);
            }
            else {
                Cookies.remove('noIntro' + projectID);
            }
        },

    }
});
