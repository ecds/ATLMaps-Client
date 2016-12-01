import Ember from 'ember';
import burgerMenu from 'ember-burger-menu';

const { $, Component, inject: { service } } = Ember;

export default Component.extend({
    browseParams: service(),

    classNameBindings: ['showingResults'],

    showingResults: false,

    // rasterResultsObserver: observer('rasters', function() {
    //     run.once(this, 'indicateResults', 'rasters');
    //     // this.indicateResults('rasters');
    //     // console.log('rasters', rasters.model.rasters.meta);
    // }),

    // Initilizes the MD tabs for the search results.
    didRender() {
        $('ul.tabs').tabs();
        // console.log('rasters', this.get('rasters.content.meta.total_count'));
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
