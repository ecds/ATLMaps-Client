import Ember from 'ember';

const { Component, get, set } = Ember;

export default Component.extend({
    classNames: ['user-menu', 'z-depth-2'],
    classNameBindings: ['userMenuShow'],

    didRender() {
        set(this, 'userMenuShow', get(this, 'showUserMenu'));
    },


    actions: {
        // toggleMenu: this.toggleProperty('showMenu')
    }
});
