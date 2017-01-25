/**
 * @private
 * Component to manage current text search.
 */
import Ember from 'ember';

const { Component, inject: { service }, get, set } = Ember;

export default Component.extend({

    browseParams: service(),

    tagNames: 'form',

    showingClearButton: false,

    actions: {
        // Take the contents of the search field and send them on to the
        // search function.
        // FIXME: I don't tink `sendAction` is still a thing.
        textSearch() {
            this.get('browseParams').setSearchText(this.get('searchTerms'));
            this.sendAction('getResults');
        },

        // Triggered when someone starts typing in input field.
        // Action shows a button to clear the search field.
        setShowClearButton() {
            set(this, 'showingClearButton', true);
        },

        // Triggered by the clear button in search field.
        clearSearch() {
            get(this, 'browseParams').setSearchText('');
            set(this, 'searchTerms', '');
            this.sendAction('getResults');
        }
    }
});
