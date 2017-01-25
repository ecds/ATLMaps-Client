/**
 * @private
 * https://emberway.io/ember-js-and-html5-drag-and-drop-fa5dfe478a9a#.23x5ssrtm
 */
import Ember from 'ember';

const {
    Component,
    get,
    inject: {
        service
    }
} = Ember;

export default Component.extend({
    mapObject: service(),
    store: service(),
    currentUser: service(),

    classNames: ['draggable-dropzone'],
    classNameBindings: ['dragClass'],
    dragClass: 'deactivated',
    tagged: '',

    dragLeave(event) {
        event.preventDefault();
        this.set('dragClass', 'deactivated');
    },

    dragOver(event) {
        event.preventDefault();
        this.set('dragClass', 'activated');
    },

    drop(event) {
        const data = event.dataTransfer.getData('text/data');
        this.sendAction('dropped', data);
        this.set('dragClass', 'deactivated');
    },

    didInsertElement() {
        get(this, 'mapObject').createMap();
        get(this, 'mapObject').mapSingleLayer(this.get('layer').findBy('data_type', 'wms'));
    }

});
