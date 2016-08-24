import Ember from 'ember';
import { EKMixin, keyUp } from 'ember-keyboard';

const {
    Component,
    inject: {
        service
    },
    on
} = Ember;

// EKX Mixin is Ember Keyboard Mixin so we can use ESC to close modal.
export default Component.extend(EKMixin, {
    showIntro: service(),
    classNames: ['intro-modal-link'],

    activateKeyboard: on('init', function() {
        this.set('keyboardActivated', true);
    }),

    closeWithEsc: on(keyUp('Escape'), function() {
        this.sendAction('action');
    }),

    actions: {

        toggleIntro() {
            this.sendAction('action');
        },

        supressIntro() {
            let projectID = this.get('project.id');

            this.get('showIntro').setCookie(projectID);
        }

    }
});
