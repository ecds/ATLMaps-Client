import Ember from 'ember';
/* globals Draggabilly */

export default Ember.Component.extend({

    VectorDetialContent: Ember.inject.service('vector-detail-content'),

    classNames: ['marker-data', 'draggable', 'modal'],

    didInsertElement(){
        let draggie = new Draggabilly( '.draggable', {
            // options
            // see http://draggabilly.desandro.com/
        });
        draggie.element.style.position = 'fixed';
        draggie.on( 'dragStart', function( /* event, pointer*/ ) {});
        // Make reference to `draggie` so we can destroy it on exit.
        Ember.set(this, 'draggie', draggie);

    },

    willDestroyElement(){
        console.log('bye');
        this.get('draggie').destroy();
    },

    actions: {
        close(){
            Ember.$("div.marker-data").hide();
            Ember.$(".active_marker").removeClass("active_marker");
            this.get('draggie').destroy();
        }
    }
});
