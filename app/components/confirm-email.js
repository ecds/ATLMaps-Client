import Ember from 'ember';

const { get, set, Component, inject: { service } } = Ember;

export default Component.extend({
    currentUser: service(),
    store: service(),
    classNameBindings: ['thinking'],
    codeSent: false,
    thinking: false,
    editEmail: false,

    actions: {
        resend() {
            const self = this;
            set(self, 'thinking', true);
            get(this, 'store').findRecord('confirmation-token', 1).then(() => {
                set(this, 'codeSent', true);
            });
        },

        editEmail() {
            set(this, 'editEmail', true);
        },

        updateEmail() {
            get(this, 'store').findRecord('user', get(this, 'currentUser.user.id')).then((user) => {
                set(user, 'identification', get(this));
            });
        }
    }
});
