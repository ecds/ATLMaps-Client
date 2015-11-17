import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        showIntro: function() {
            this.setProperties({isShowingIntroModal: true});
        }
    }
});
