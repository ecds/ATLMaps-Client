/**
 * @private
 * Component to manage current text search.
 */
import Ember from 'ember';

const { Component, inject: { service }, get } = Ember;

export default Component.extend({

    browseParams: service(),
    classNames: ['search-box'],
    tagNames: 'form',

    // Had to add the search event as a custom event in `config/environment.js`.
    search() {
        get(this, 'browseParams').setSearchText(get(this, 'searchTerms'));
        this.sendAction('getResults');
    }
});
