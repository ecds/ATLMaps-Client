import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
    classNames: ['scroll-container'],

    nextPage(meta) {
        this.getResults(meta.next_page);
    }
});
