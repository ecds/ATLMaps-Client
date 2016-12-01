import Ember from 'ember';

const { $, Component, inject: { service } } = Ember;

export default Component.extend({
    classNames: ['project-pane'],
    flashMessage: service(),

    didInsertElement() {
        // The `collapsible` method is in the Materialize js.
        $('.collapsible').collapsible({ accordion: true });
    },

});
