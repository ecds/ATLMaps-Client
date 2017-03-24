import Ember from 'ember';

const { get, set, Component, inject: { service } } = Ember;

export default Component.extend({
    currentUser: service(),
    store: service(),
    codeSent: false,
    classNameBindings: ['thinking'],
    thinking: false,

    actions: {
        resend() {
            const self = this;
            set(self, 'thinking', true);
            get(this, 'store').findRecord('confirmation-token', 1);
        }
    }
});
