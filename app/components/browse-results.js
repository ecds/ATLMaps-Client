import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
    browseParams: service(),

    didInsertElement() {
        this.sendAction('getResults');
    }
});
