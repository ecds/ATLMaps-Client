import Ember from 'ember';

/* globals List */

export default Ember.Component.extend({

    didInsertElement: function(){
        // 
        Ember.$(".layer-search").focus(function(){

            console.log("hello");

            var options = {
                valueNames: [ 'name', 'description' ],
            };

            new List('searchableRasterLayers', options);

            new List('searchableVectorLayers', options);

        });
    },

    actions: {

    }

});
