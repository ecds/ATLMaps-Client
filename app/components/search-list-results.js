import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['scroll-container'],

    nextPage(meta) {
        this.getResults(meta.next_page);
    }
});
