import Ember from 'ember';

const {
    $,
    Component,
    inject: {
        service
    },
    get
} = Ember;

export default Component.extend({
    session: service(),
    currentUser: service(),
    tagName: 'header',
    classNames: ['navigation'],
    showingSearch: false,

    didRender() {
        // this.get('currentUser').load();
        // const foo = get(this, 'session.isAuthenticated');
        // console.log('foo', foo);
        /*
            I'm not a huge fan of this. But got it from the same logic that
            the modal addon uses. https://github.com/yapplabs/ember-modal-dialog/blob/806ec6c18fa7b9af711311652e4d151512841ead/addon/components/modal-dialog.js#L34-L39
            those folks seem pretty smart.
            Anyway, the goal here is for a click anywhere to hide the user menu.
            Except the user menu...of course ;)
            This is done by adding a click listener to the whole document. However,
            the setting/toggeling only happens if the click happens outside the
            element with a class of `user-menu`.
            Showing is toggled only by an element with the class of `toggle-user-menu`.
         */
        // const handleClick = (event) => {
        //     if ($(event.target).closest('.user-menu').length > 0) {
        //         set(this, 'showUserMenu', true);
        //     } else if ($(event.target).hasClass('toggle-user-menu')) {
        //         this.toggleProperty('showUserMenu');
        //     } else if ($(event.target).hasClass('user-menu-action')) {
        //         set(this, 'showUserMenu', true);
        //     } else {
        //         set(this, 'showUserMenu', false);
        //     }
        // };

        // $(document).on('click', handleClick);
        const menuToggle = $('#js-mobile-menu').unbind();
        $('#js-navigation-menu').removeClass('show');
        //
        // This is taken from refills.bourbon.io
        // It collapses the links for smaller screens.
        // I'm not sure we need to bother.
        menuToggle.on('click', (e) => {
            e.preventDefault();
            $('#js-navigation-menu').slideToggle(() => {
                if ($('#js-navigation-menu').is(':hidden')) {
                    $('#js-navigation-menu').removeAttr('style');
                }
            });
        });
    },

    willDestroyElement() {
        $(document).off('click');
    },

    actions: {
        invalidateSession() {
            get(this, 'session').invalidate();
        },

        updateDisplayName() {
            get(this, 'currentUser').update();
        },

        cancelUpdate() {
            //
        }
    }
});
