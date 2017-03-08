import Ember from 'ember';

const { Component, get, set, inject: { service } } = Ember;

export default Component.extend({
    classNames: ['user-menu', 'z-depth-2', 'register-click'],
    classNameBindings: ['userMenuShow'],
    currentUser: service(),

    didRender() {
        this.get('currentUser').load();
    },

    didUpdateAttrs() {
        // console.log('this2', this);
        this.get('currentUser').load();
        set(this, 'userMenuShow', get(this, 'showUserMenu'));
    }
});
