import Ember from 'ember';

export default Ember.Route.extend({

    dataColors: Ember.inject.service('data-colors'),

    actions: {
        toggleAllVectorLayers(){
            const project = this.currentModel;
            // Toggle a model attribute for persistance
            project.toggleProperty('showing_all_vectors');
            // Trigger the toggles for each layer.
            // Setting the prop does not trigger the change event.
            Ember.$('.vector-toggle').trigger("change");
        },

        toggleVectorLayer(layer){
            // Toggle the opacity of vectors.
            Ember.$('.vectorData.'+layer.get('vector_layer_id.slug')).fadeToggle();
            // Toggle the layer's model attribute.
            layer.toggleProperty('showing');
            const project = this.currentModel;
            // Make the projects `showing_all_vectors` model attribute true only if the layer
            // was previously hidden.
            console.log(project.get('hidden_vectors').length);
            if (project.get('hidden_vectors').length === 0) {
                // This will not trigger the change event on the toggle all.
                project.setProperties({showing_all_vectors: false });
            }
            else {
                project.setProperties({showing_all_vectors: true });
            }
        }
    }
});
