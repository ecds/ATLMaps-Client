import Ember from 'ember';

const limits = [
    { value: 10, label: 'Show: 10 Per Page' },
    { value: 25, label: 'Show: 25 Per Page' },
    { value: 50, label: 'Show: 50 Per Page' },
    { value: 100, label: 'Show: 100 Per Page' }
];

const { Component, inject: { service }, set } = Ember;

export default Component.extend({
    classNames: ['pagination'],
    tagName: 'nav',
    browseParams: service('browse-params'),
    searchEnabled: false,
    limits,
    limit: limits[0],

    actions: {

        updateLimt(newLimit) {
            set(this, 'browseParams.searchLimit', newLimit.value);
            this.sendAction('getResults');
        }
    }
});
