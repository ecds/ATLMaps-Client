import Ember from 'ember';

const {
    Component,
    get,
    inject: {
        service
    }
} = Ember;

export default Component.extend({
    currentUser: service(),

    tagName: 'button',

    classNames: ['btn', 'btn-default'],

    click() {
        this.sendAction('action', get(this, 'currentUser.previous'));
    }
});
