import Ember from 'ember';

export default Ember.Controller.extend({
    needs: "project",

    isEditing: Ember.computed.alias("controllers.project.isEditing"),

    // layers: function(){
    //     return this.model.get('raster_layer_ids');
    // }.property()
});
