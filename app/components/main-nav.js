import Ember from 'ember';

const {
    $,
    Component,
    inject: {
        service
    },
    set
} = Ember;

export default Component.extend({
    currentUser: service(),
    session: service(),

    didInsertElement() {
        const self = this;
        $(document).on('click', () => {
            if (!$(event.target).parents('.ignore-click').length) {
                set(self, 'showUserMenu', false);
            }
        });
    },

    willDestroyElement() {
        $(document).off('click');
    }
});
