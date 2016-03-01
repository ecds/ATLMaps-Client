import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

    isEditing: false,

    editSuccess: false,

    editFail: false,

    showBrowse: false,

    rastersActive: false,

    rasterLayers: function() {

        var rasterLayers = DS.PromiseObject.create({
            promise: this.store.query('raster-layer', {projectID: this.model.get('id')})
        });

        rasterLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return rasterLayers;


    }.property(),

    vectorLayers: function() {

        var vectorLayers = DS.PromiseObject.create({
            promise: this.store.query('vector-layer', {projectID: this.model.get('id')})
        });

        vectorLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return vectorLayers;


    }.property(),

    showingAllLayers: true,

    actions: {
        toggleEdit: function(){
            this.toggleProperty('isEditing');
        }
    }
});
