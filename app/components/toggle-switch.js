import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
    tagName: 'span',
    classNames: ['label-switch']

    // actions: {
    //     toggleLayer(layer) {
    //         if (get(layer, 'opacity') === 0) {
    //             layer.setProperties({ opacity: 10 });
    //         } else {
    //             layer.setProperties({ opacity: 0 });
    //         }
    //     },
    //
    //     toggleAll(layers) {
    //         const toggleSwitch = document.getElementById('toggle-all');
    //         layers.forEach((layer) => {
    //             if (toggleSwitch.checked) {
    //                 layer.setProperties({ opacity: 10 });
    //                 if (get(layer, 'sliderObject')) {
    //                     get(layer, 'sliderObject').set(10);
    //                 }
    //             } else {
    //                 layer.setProperties({ opacity: 0 });
    //                 if (get(layer, 'sliderObject')) {
    //                     get(layer, 'sliderObject').set(0);
    //                 }
    //             }
    //         });
    //     }
    // }
});
