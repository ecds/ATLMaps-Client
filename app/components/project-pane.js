import Ember from 'ember';

const { $, Component } = Ember;

export default Component.extend({
    classNames: ['project-pane'],

    didInsertElement() {
        $('.collapsible').collapsible({ accordion: true });
  },

});
