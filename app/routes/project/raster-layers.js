import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        didTransnition: function(){
            this.transitionTo('project.help');
            console.log('hi');
            console.log(this.get('showProjIntroModal'));
        }
    }
});
