import Ember from 'ember';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

const {
    Component,
    inject: { service },
    get,
    on
} = Ember;

// EKX Mixin is Ember Keyboard Mixin so we can use ESC to close modal.
export default Component.extend(EKMixin, {
    cookies: service(),

    classNames: ['intro-modal-link'],

    keyboardActivated: true,

    closeWithEsc: on(keyUp('Escape'), (event) => {
        console.log('project', this);
    }),

    actions: {

        // toggleIntro() {
        //     this.sendAction('action');
        // },

        suppressIntro() {
            const model = get(this, 'project');
            const cookieService = get(this, 'cookies');
            const cookieName = `noIntro${model.id}`;

            if (model.hasSuppressCookie === true) {
                cookieService.clear(cookieName);
                model.setProperties({ hasSuppressCookie: false });
            } else {
                cookieService.write(cookieName, `Surppress-intro-for-project-${model.id}-on-ATLMaps.`);
                model.setProperties({ hasSuppressCookie: true });
            }
        }
    }
});
