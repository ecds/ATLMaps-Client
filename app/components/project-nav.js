import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({

    classNames: ['project-nav', 'container', 'z-depth-3'],
    classNameBindings: ['hideNav'],
    tagName: 'ul',
    hideNav: false,

    actions: {
        toggleNav() {
            this.toggleProperty('hideNav');
        }
    }
});
