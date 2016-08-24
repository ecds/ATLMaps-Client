import Ember from 'ember';

const {
    Component,
    inject: {
        service
    }

} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-text'],

    searchTerms: function() {
        return this.get('browseParams.searchText');
    }.property(),

    actions: {
        textSearch: function() {
            this.get('browseParams').setSearchText(this.get('searchTerms'));
            this.sendAction('getResults');
        }
    }
});
