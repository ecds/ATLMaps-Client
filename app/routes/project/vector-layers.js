import Ember from 'ember';

export default Ember.Route.extend({

    // dataColors: Ember.inject.service('data-colors'),

    actions: {
        toggleAllVectorLayers(){
            // console.log('dude');
            const project = this.currentModel;
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

            // const project = this.currentModel;
            // // Make the projects `showing_all_vectors` model attribute true only if the layer
            // // was previously hidden.
            // if (project.get('hidden_vectors').length === 0) {
            //     // This will not trigger the change event on the toggle all.
            //     project.setProperties({showing_all_vectors: false });
            // }
            // else {
            //     project.setProperties({showing_all_vectors: true });
            // }
        }
    }
});
