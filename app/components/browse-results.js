import Ember from 'ember';

const { Component, get } = Ember;

export default Component.extend({
    actions: {
        toggleResults() {
            // console.log('hi');
        },

        // nextPage() {
        //     let meta = get(this, 'content.meta');
        //     console.log('meta', meta);
        // }
    }
});
