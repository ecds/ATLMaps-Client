import Ember from 'ember';
/* globals Draggabilly */

export default Ember.Component.extend({

    didInsertElement(){
        let draggie = new Draggabilly( '.draggable', {
            // options
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
            Ember.$("div.marker-data").hide();
            Ember.$(".active_marker").removeClass();
        }
    }
});