import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['col', 's12', 'scroll-container'],

    nextPage(meta) {
        this.getResults(meta.next_page);
    }
});
