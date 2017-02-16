import Ember from 'ember';

const { $, Component } = Ember;

export default Component.extend({

    didInsertElement() {
        // QUESTION: Is this needed?
        $(document).ready(() => {
            $('.collapsible').collapsible({
                accordion: true
            });
        });
    }
});
