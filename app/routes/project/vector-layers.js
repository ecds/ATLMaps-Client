import Ember from 'ember';

export default Ember.Route.extend({

    dataColors: Ember.inject.service('data-colors'),

    actions: {
        toggleAllVectorLayers(){
            // First we figure out if the toggle all button is now `checked`
            // or `undefined`
            let checked = Ember.$('#toggle-all-vectors').prop('checked');
            // If checked, we're going to fade in all the vector layers.
            if (checked){
                // This sets all the individual vector layer's toggle to `checked`.
                Ember.$('.vector-toggle').prop('checked', checked);
                // So we want to see all the layers. Fade in any that are hidden.
                Ember.$('.vectorData').fadeIn();
            }
            // Otherwise, we don't want see any vector layers so set the
            // `checked` property fot `false`.
            else {
                // This sets all the individual vector layer toggel's
                // `checked` attribute to false.
                Ember.$('.vector-toggle').prop('checked', false);
                // Fade out all the vector layers on the map.
                Ember.$('.vectorData').fadeOut();
            }

        },

        toggleVectorLayer(layer){
            Ember.$('.vectorData.'+layer.get('slug')).fadeToggle();
        },

        actions: {

        }
    }
});
