import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
    isShowingRasterModal: false,

    isShowingVectorModal: false,

    rasterLayers: function() {

        var rasterLayers = DS.PromiseObject.create({
            promise: this.store.find('raster-layer', {projectID: this.model.get('id')})
        });

        rasterLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return rasterLayers;


    }.property(),

    vectorLayers: function() {

        var vectorLayers = DS.PromiseObject.create({
            promise: this.store.find('vector-layer', {projectID: this.model.get('id')})
        });

        vectorLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return vectorLayers;


    }.property(),

    actions: {

        toggleRasterModal: function(){
            this.toggleProperty('isShowingRasterModal');
            var parentController = this.controllerFor('project');
            parentController.send('initProjectUI', this.model);
            
        },

        toggleVectorModal: function(){
            this.toggleProperty('isShowingVectorModal');
            var parentController = this.controllerFor('project');
            Ember.run.later(this, function() {
            parentController.send('initProjectUI', this.model);
        }, 1500);
        }
    }
});
