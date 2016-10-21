import Ember from 'ember';

const { Component, get, inject: { service }, set } = Ember;

export default Component.extend({

    classNames: ['project-nav', 'container'],
    classNameBindings: ['projectIndex'],

    projectIndex: true,

    router: service('-routing'),

    didInsertElement() {
        let r = get(this, 'router');
        r.addObserver('currentRouteName', this, 'currentRouteNameChanged');
    },

    didReceiveAttrs() {
        let r = get(this, 'router');
        let routes = get(r, 'currentRouteName').split('.');
        if (routes.pop() !== 'index') {
            set(this, 'projectIndex', false);
        }
    },

    currentRouteNameChanged(router, propertyName) {
        let routes = router.get(propertyName).split('.');
        if (routes.pop() === 'index') {
            console.log('true', true);
            set(this, 'projectIndex', true);
        } else {
            console.log('false', false);
            set(this, 'projectIndex', false);
        }
        console.log('title', get(this, 'projectIndex'));
    }

});
