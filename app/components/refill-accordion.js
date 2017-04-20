import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
    tagName: 'ul',
    classNames: ['accordion'],

    actions: {
        expand() {
            console.log('this', this);
        }
    }
});
