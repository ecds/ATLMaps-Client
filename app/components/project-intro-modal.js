import Ember from 'ember';

export default Ember.Component.extend({
    isShowingIntroModal: true,

    actions: {
        hideIntro: function() {
            this.setProperties({isShowingIntroModal: false});
        },

        showIntro: function() {
            this.setProperties({isShowingIntroModal: true});
        }
    }
});
