import Ember from 'ember';

/* globals interact */

const {
    $,
    Component,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    vectorDetialContent: service(),

    classNames: ['vector-info', 'resize-container', 'project-pane', 'resize-drag', 'hoverable'],

    didInsertElement() {

        interact('.resize-drag')
            .draggable({
                onmove: dragMoveListener
            })
            .allowFrom('.drag-handle')
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
                // Destructuring
                // This had been written as `let target = event.target`.
                // This is better?
                let { target } = { target: event.target };
                let targetContainer = target.lastElementChild;

                let x = parseFloat(target.getAttribute('data-x')) || 0;
                let y = parseFloat(target.getAttribute('data-y')) || 0;

                // update the element's style
                target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;
                // For scorlling, vector-detail-container has a fixed height.
                // We have to update that too.
                targetContainer.style.height = `${event.rect.height}px`;

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    `translate(${x}px,${y}px)`;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            });

        function dragMoveListener(event) {
            // Destructuring?
            let { target } = { target: event.target };
            // keep the dragged position in the data-x/data-y attributes
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                `translate(${x}px,${y}px)`;

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        // this is used later in the resizing and gesture demos
        window.dragMoveListener = dragMoveListener;
        // Ember.set(this,'dragMoveListener' dragMoveListener);
    },
    //
    didDestroyElement() {
        delete(window.dragMoveListener);
    },

    actions: {
        close() {
            $('div.vector-info').hide();
            $('.marker-content iframe').remove();
            $('.div.marker-content').empty();
            $('.active_marker').removeClass('active_marker');
            // this.get('draggie').destroy();
        }
    }
});
