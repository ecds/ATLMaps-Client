import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
	isShowingRasterModal: false,

    isShowingVectorModal: false,

    sortProperties: ['name'],

    rasterLayers: function() {

        var rasterLayers = DS.PromiseObject.create({
            promise: this.store.find('raster-layer', {projectID: this.get('model.id')})
        });

        rasterLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return rasterLayers;


    }.property(),

    vectorLayers: function() {

        var vectorLayers = DS.PromiseObject.create({
            promise: this.store.find('vector-layer', {projectID: this.get('model.id')})
        });

        vectorLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return vectorLayers;


    }.property(),

    actions: {
    	toggleModal: function(){

            if (this.get('type') === 'raster') {
                this.toggleProperty('isShowingRasterModal');
            }
            else if (this.get('type') === 'vector'){
                this.toggleProperty('isShowingVectorModal');
            }
            this.sendAction('action', this.get('model'));
        },

        closeRasterModal: function(){
            this.set('isShowingRasterModal', false);
        },

        closeVectorModal: function(){
            this.set('isShowingVectorModal', false);
        },

        sendRasterLayerToAdd: function(layer){
            this.sendAction('add', layer);
        },

        sendRasterLayerToRemove: function(layer){
            this.sendAction('remove', layer);
        },

        sendVectorLayerToAdd: function(layer){
            this.sendAction('add', layer);
        },

        sendVectorLayerToRemove: function(layer){
            this.sendAction('remove', layer);
        }

    }
});
