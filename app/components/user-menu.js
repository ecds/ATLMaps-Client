/*
 * Component to determine if the user menu is shown and what is shown in it.
 */
import Ember from 'ember';

const { Component, get, set, inject: { service } } = Ember;

export default Component.extend({
    // The `register-click` class excludes the menu from the listener
    // that hides the menu when any other element is clicked.
    classNames: ['user-menu', 'z-depth-2', 'register-click'],
    classNameBindings: ['userMenuShow'],
    currentUser: service(),
    session: service(),

    didRender() {
        this.get('currentUser').load();
    },

    didUpdateAttrs() {
        // if (get(this, 'currentUser.confirmed')) {
        //     set(this, 'userMenuShow', get(this, 'showUserMenu'));
        // }
        set(this, 'userMenuShow', get(this, 'showUserMenu'));
    }
});
