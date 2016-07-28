import Ember from 'ember';
/* globals Draggabilly */

export default Ember.Component.extend({

    VectorDetialContent: Ember.inject.service('vector-detail-content'),

    classNames: ['vector-info', 'modal', 'draggable'],
    // attributeBindings: ['draggable'],
    // draggable : 'true',
    //
    // dropEnd(event) {
    //     console.log('holly shit');
    // },

    didInsertElement(){
        let draggie = new Draggabilly( '.draggable', {
            // options
            // see http://draggabilly.desandro.com/
            handle: '.drag-handle'
        });
        draggie.element.style.position = 'fixed';
        draggie.on( 'dragStart', function( /* event, pointer*/ ) {});
        // Make reference to `draggie` so we can destroy it on exit.
        Ember.set(this, 'draggie', draggie);

    },

    willDestroyElement(){
        this.get('draggie').destroy();
    },

    actions: {
        close(){
            Ember.$("div.vector-info").hide();
            Ember.$(".marker-content iframe").remove();
            Ember.$(".div.marker-content").empty();
            Ember.$(".active_marker").removeClass("active_marker");
            this.get('draggie').destroy();
        }
    }
});
