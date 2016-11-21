import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({

    // dataColors: Ember.inject.service('data-colors'),

    actions: {
        toggleAllVectorLayers(){
            const project = this.currentModel.project;
            let vectors = project.get('vector_layer_project_ids');
            if (project.get('visiable_vector') === true) {
                vectors.forEach(function(vectorProj /*index*/ ){
                    vectorProj.setProperties({showing: false});
                    Ember.$('.vectorData.'+vectorProj.get('vector_layer_id.slug')).css('opacity', 0);
                });
            } else {
                vectors.forEach(function(vectorProj /*index*/ ){
                    vectorProj.setProperties({showing: true});
                    Ember.$('.vectorData.'+vectorProj.get('vector_layer_id.slug')).css('opacity', 1);
                });
            }
        },

        toggleVectorLayer(layer){
            // Toggle the layer's model attribute.
            layer.toggleProperty('showing');
            let opacity;
            if (layer.get('showing') === true ) {
                opacity = 1;
            } else {
                opacity = 0;
            }
            Ember.$('.vectorData.'+layer.get('vector_layer_id.slug')).css('opacity', opacity);
        }
    }
});
