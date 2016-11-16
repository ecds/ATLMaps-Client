import Ember from 'ember';

const { $, Component } = Ember;

export default Component.extend({
    classNames: ['project-pane'],

    didInsertElement() {
        // The `collapsible` method is in the Materialize js.
        $('.collapsible').collapsible({ accordion: true });
    },

});
