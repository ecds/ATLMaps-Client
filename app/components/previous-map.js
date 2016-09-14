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
        let fuckfuckfuck = this.get('currentUser.previous');
        console.log('fuckfuckfuck', fuckfuckfuck);
        this.sendAction('action', get(this, 'currentUser.previous'));
    }
});
