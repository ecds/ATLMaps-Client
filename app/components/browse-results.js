/**
 * Component to initiate UI for search results.
 */
import Ember from 'ember';
import burgerMenu from 'ember-burger-menu';

const { $, Component, inject: { service } } = Ember;

export default Component.extend({
    browseParams: service(),

    classNameBindings: ['showingResults'],

    showingResults: false,

    // Initilizes the MaterializeCSS tabs for the search results.
    didRender() {
        $('ul.tabs').tabs();
    },

    actions: {
        toggleResults() {
            // TODO: Get rid of burgerMenu.
            burgerMenu.toggleProperty('open');
        }
    }
});
