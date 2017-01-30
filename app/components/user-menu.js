import Ember from 'ember';

const { Component, get, set } = Ember;

export default Component.extend({
    classNames: ['user-menu', 'z-depth-2', 'ignore-click'],
    classNameBindings: ['userMenuShow'],

    didRender() {
        set(this, 'userMenuShow', get(this, 'showUserMenu'));
    }
});
