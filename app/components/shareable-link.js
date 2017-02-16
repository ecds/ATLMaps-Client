import Ember from 'ember';

const {
    Component,
    get,
    inject: {
        service
    },
    run
} = Ember;

export default Component.extend({
    flashMessage: service(),
    isShowingModal: false,
    tagName: 'span',
    // classNames: ['shareable-button'],

    actions: {
        toggleShareableLink: function toggleModal() {
            this.toggleProperty('isShowingModal');
        },

        success() {
            const flash = get(this, 'flashMessage');
            flash.setProperties({
                message: 'URL COPPIED TO CLIPBOARD',
                show: true,
                success: true
            });
            run.later(this, () => {
                flash.setProperties({ message: '', show: false });
            }, 3000);
        },

        error() {
            const flash = get(this, 'flashMessage');
            flash.setProperties({
                message: 'FAILED TO COPY URL',
                show: true,
                success: false
            });
            run.later(this, () => {
                flash.setProperties({ show: false });
            }, 300);
        }
    }
});
