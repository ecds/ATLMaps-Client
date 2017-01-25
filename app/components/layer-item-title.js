import Ember from 'ember';

const { Component, get, set } = Ember;

export default Component.extend({
    classNames: ['title', 'col', 's10'],

    actions: {
        expand() {
            const current = get(this, 'layer.active_in_list');
            const layers = get(this, 'layers') || [];
            layers.forEach((layer) => {
                set(layer, 'active_in_list', false);
            });
            if (!current) {
                set(this, 'layer.active_in_list', true);
            } else {
                set(this, 'layer.active_in_list', false);
            }
        }
    }
});
