import Ember from 'ember';
import burgerMenu from 'ember-burger-menu';

const { $, Component, inject: { service } } = Ember;

export default Component.extend({
    browseParams: service(),

    classNameBindings: ['showingResults'],

    showingResults: false,

    // Initilizes the MD tabs for the search results.
    didRender() {
        $('ul.tabs').tabs();
    },

    actions: {
        toggleResults() {
            burgerMenu.toggleProperty('open');
        }
    }

    // didInsertElement() {
    //     this.sendAction('getResults');
    // }
});
