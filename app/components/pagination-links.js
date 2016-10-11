import Ember from 'ember';

const { Component, computed, get } = Ember;

export default Component.extend({
    range: computed(function() {
        console.log('get meta', get(this, 'meta'));
    })
});
