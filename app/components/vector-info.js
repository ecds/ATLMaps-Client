import Ember from 'ember';
/* globals Draggabilly */

export default Ember.Component.extend({

    // // Iniatate the dragging
    // var draggie = new Draggabilly( '.draggable', {
    //     handle: '.drag-window'
    // });
    //
    // // Draggabilly adds a style of position = relative to the
    // // element. This prevents the abality to click through where
    // // the div was originally. So we change it to absolute.
    // draggie.element.style.position = 'absolute';
    //
    // draggie.on( 'dragStart', function( /* event, pointer*/ ) {});
    //
    // Ember.$('.marker-data').resizeThis({ noNative: true });

    didInsertElement(){
        var draggie = new Draggabilly( '.draggable', {
            // options
        });
        draggie.element.style.position = 'fixed';
        draggie.on( 'dragStart', function( /* event, pointer*/ ) {});
    },

    actions: {
        close(){
            Ember.$("div.marker-data").hide();
        }
    }
});
