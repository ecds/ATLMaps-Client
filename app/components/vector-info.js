import Ember from 'ember';
/* globals interact */

export default Ember.Component.extend({

    VectorDetialContent: Ember.inject.service('vector-detail-content'),

    classNames: ['vector-info'],

    didInsertElement() {

        interact('.resize-drag')
            .draggable({
                onmove: dragMoveListener
            })
            .resizable({
                preserveAspectRatio: true,
                edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true
                }
            })
            .on('resizemove', function(event) {
                var target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            });


        function dragMoveListener(event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        // this is used later in the resizing and gesture demos
        window.dragMoveListener = dragMoveListener;
        // Ember.set(this,'dragMoveListener' dragMoveListener);
    },
    //
    didDestroyElement(){
        delete(window.dragMoveListener);
    },

    actions: {
        close() {
            Ember.$("div.vector-info").hide();
            Ember.$(".marker-content iframe").remove();
            Ember.$(".div.marker-content").empty();
            Ember.$(".active_marker").removeClass("active_marker");
            // this.get('draggie').destroy();
        }
    }
});
