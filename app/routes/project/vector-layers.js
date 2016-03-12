import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        toggleAllVectorLayers(){
            Ember.$('.vector-toggle').attr('checkded', !this);
            Ember.$('.vectorData').fadeToggle();
        },

        toggleVectorLayer(layer){
            Ember.$('.vectorData.'+layer.get('slug')).fadeToggle();
        }
    }
});
