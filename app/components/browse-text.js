import Ember from 'ember';

const {
    Component,
    inject: {
        service
    }

} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-text', 'container'],

    searchTerms: function() {
        return this.get('browseParams.searchText');
    }.property(),

    actions: {
        textSearch() {
            this.get('browseParams').setSearchText(this.get('searchTerms'));
            console.log('text', this.get('browseParams'));
            this.sendAction('getResults');
        }
    }
});
