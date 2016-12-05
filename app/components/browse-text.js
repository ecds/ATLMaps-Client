import Ember from 'ember';

const {
    Component,
    inject: {
        service
    },
    get,
    set

} = Ember;

export default Component.extend({

    browseParams: service(),

    // searchTerms: get(this, 'browseParams.searchTerms'),

    tagNames: 'form',

    showingClearButton: false,

    // searchTerms: function() {
    //     return this.get('browseParams.searchText');
    // }.property(),

    searchTerms: function() {
        return this.get('browseParams.searchText');
    }.property(),

    actions: {
        textSearch() {
            this.get('browseParams').setSearchText(this.get('searchTerms'));
            this.sendAction('getResults');
        },

        setShowClearButton() {
            set(this, 'showingClearButton', true);
        },

        clearSearch() {
            get(this, 'browseParams').setSearchText('');
            set(this, 'searchTerms', '');
            this.sendAction('getResults');
        }
    }
});
