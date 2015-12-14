import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  isShowingRasterModal: false,

    isShowingVectorModal: false,

    sortProperties: ['name'],

    results: function() {
      return [];
    }.property(),

    rasterLayers: function() {

        var rasterLayers = DS.PromiseObject.create({
            promise: this.store.query('raster-layer', {projectID: this.get('model.id')})
        });

        rasterLayers.then(function(){
            // Maybe remove a laoding gif?
        });

        return rasterLayers;


    }.property(),

    vectorLayers: function() {

        var vectorLayers = DS.PromiseObject.create({
            promise: this.store.query('vector-layer', {projectID: this.get('model.id')})
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

        search: function(){
          var searchTerm = Ember.$("input#raster-search").val();
          var searchResults = this.store.query('rasterLayer', {query: searchTerm, projectID: this.get('model.id')});
          this.setProperties({results: searchResults});
          searchResults.then(function(){
            if (searchResults.get('length') === 0) {
              Ember.$('h3.use_search').hide();
              Ember.$('h3.no_results').show();
            }
            else {
              Ember.$('h3.use_search').hide();
              Ember.$('h3.no_results').hide();
            }
          });
        },

        closeRasterModal: function(){
            this.set('isShowingRasterModal', false);
            this.set('results', []);
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
