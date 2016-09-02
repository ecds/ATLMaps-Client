import Ember from 'ember';

const {
    Component,
    get,
    inject: {
        service
    },
    set
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
        let data = event.dataTransfer.getData('text/data');
        console.log('event.dataTransfer', event.dataTransfer);
        this.sendAction('dropped', data);
        this.set('dragClass', 'deactivated');
    },

    didInsertElement() {
        get(this, 'mapObject').createMap();
        get(this, 'mapObject').mapSingleLayer(this.get('layer'));
    }

});
