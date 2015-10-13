import Ember from 'ember';

/* globals List */

export default Ember.Component.extend({

    didInsertElement: function(){
        // 
        Ember.$(".layer-search").focus(function(){

            var options = {
                valueNames: [ 'name', 'description', 'tags', 'institution' ],
            };

            new List('searchableRasterLayers', options);

            new List('searchableVectorLayers', options);

        });
    },

    actions: {
        close: function() {
            this.sendAction('action');
        }
    }

});
