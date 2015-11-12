import Ember from 'ember';
/* global Cookies */

export default Ember.Component.extend({
    isShowingIntroModal: true,

    notShowingIntro: false,

    clickListen: function(){
        var projectID = this.get('project.id');

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
        console.log(this.notShowingIntro);

        if (Cookies.get('noIntro' + projectID)) {
            this.setProperties({isShowingIntroModal: false});
            this.setProperties({notShowingIntro: true});
        }
        else {
            this.setProperties({isShowingIntroModal: true});
            this.setProperties({notShowingIntro: false});
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
