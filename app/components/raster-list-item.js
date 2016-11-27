import Ember from 'ember';

const { $, Component } = Ember;

export default Component.extend({

    didInsertElement() {
        $(document).ready(function(){
            $('.collapsible').collapsible({
                accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            });
        });
    },
});
