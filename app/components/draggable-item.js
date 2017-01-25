import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
    classNames: ['draggable-item'],
    classNameBindings: ['taggedClass'],
    attributeBindings: ['draggable'],
    draggable: 'true',
    taggedClass: 'taggable',

    dragStart(event) {
        const tag = this.get('content');
        return event.dataTransfer.setData('text/data', tag.get('id'), 'obj');
    },

    click() {
        this.sendAction('action', this.tag.id);
    }
});
