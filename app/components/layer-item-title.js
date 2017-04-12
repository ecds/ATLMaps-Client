import Ember from 'ember';

const { $, Component, get } = Ember;

export default Component.extend({
    classNames: ['layer-list-item-title'],

    actions: {
        expand() {
            get(this, 'layer').toggleProperty('active_in_list');
            $(`#${get(this, 'layer.slug')}-content`).slideToggle();
        }
    }
});
