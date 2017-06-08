import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
    classNames: ['card'],
    isShowingModal: false,

    actions: {
        toggleActionMenu() {
            this.toggleProperty('isShowingModal');
        }
    }
});
