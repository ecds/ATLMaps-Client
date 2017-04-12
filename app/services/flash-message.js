import Ember from 'ember';

const { run, set, Service } = Ember;

export default Service.extend({

    init() {
        this._super(...arguments);
    },

    savedMessage(message) {
        const self = this;
        set(this, 'message', message);
        set(this, 'success', true);
        set(this, 'show', true);
        run.later(this, () => {
            self.clearMessage();
        }, 3000);
    },

    failedMessage(message) {
        const self = this;
        set(this, 'message', message);
        set(this, 'show', true);
        set(this, 'success', false);
        run.later(this, () => {
            self.clearMessage();
        }, 3000);
    },

    clearMessage() {
        set(this, 'message', '');
        set(this, 'show', false);
    }

});
