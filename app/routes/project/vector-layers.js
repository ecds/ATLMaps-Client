import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        didTransition: function(){
            console.log('heloooooooooooooo');
            this.transitionTo('project.info');
        }
        // showIntro: function() {
        //     this.setProperties({isShowingIntroModal: true});
        // }
    }
});
