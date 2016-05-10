import Ember from 'ember';

export default Ember.Component.extend({

    isShowing: false,
    classNames: ['vector-options', 'pull-right'],

    click(){
        this.toggleProperty('isShowing');
        console.log('isShowing');
    },
    actions: {
        toggleModal(){
            this.toggleProperty('isShowing');
        }
    }

    // mouseEnter(){console.log("good lord the mouse has entered.");},
});
