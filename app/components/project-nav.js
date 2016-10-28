import Ember from 'ember';

const { Component, get } = Ember;

export default Component.extend({

    classNames: ['project-nav', 'container', 'z-depth-3'],
    classNameBindings: ['hideNav'],
    tagName: 'ul',
    hideNav: false,

    actions: {
        toggleNav() {
            let show = get(this, 'hideNav');
            this.toggleProperty('hideNav');
        }
    }
});
