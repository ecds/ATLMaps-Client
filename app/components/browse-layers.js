import Ember from 'ember';

export default Ember.Component.extend({

  panelActions: Ember.inject.service(),

  categories: function(){
    // Return a sorted list of all categories.
    // The tags are sorted on the model.
    return Ember.ArrayProxy.create({
        content: this.store.findAll('category'),
        sort: function(){
            this.set('sortProperties', ['name']);
        }
    });
  }.property(),

  institutions: function(){
      return Ember.ArrayProxy.create({
          content: this.store.findAll('institution'),
          sort: function(){
              this.set('sortProperties', ['name']);
          }
      });
  }.property(),

  selectedInstitution: '',

  // Number of tags that are checked.
  checkedTags: '',

  results: function() {
      return this.store.queryRecord('search', {});
  }.property('results'),

  getResults: function(){
      var tags = this.get('checkedTags');
      var institution = this.get('selectedInstitution');

      var searchResults = this.store.queryRecord('search', {tags: tags, name: institution});

      if (tags.length > 0 || institution !== '') {
          this.setProperties({ results: searchResults });
      }
      else {
          this.setProperties({results: []});
      }

  },

  collectCheckedTags: function(){
      var tags = [];
      Ember.$(".tags:checked").each(function(){
          tags.push(this.name);
      });
      return tags;
  },

  didInsertElement: function() {
      Ember.$(".browse-cards div.browse-form").hide();
      Ember.$(".browse-by-tags").show();
  },

  didUpdate: function() {
      var results = this.get('results');

      var rasterCount = results.get('content.raster_layer_ids.length');

      var vectorCount = results.get('content.vector_layer_ids.length');
      if ((rasterCount === 0 || rasterCount === 'undefined') && (vectorCount === 0 || vectorCount === 'undefined') ){
          Ember.$('.browse-results').hide();
      }
      else{
          Ember.$('.browse-results').show();
      }

      if (rasterCount > vectorCount || rasterCount === vectorCount) {
          Ember.$('.vector-results').hide();
          Ember.$('.raster-results').show();
          Ember.$('.raster-result-tab').addClass("active");
          Ember.$('.vector-result-tab').removeClass("active");
      }
      else if (rasterCount < vectorCount){
          Ember.$('.raster-results').hide();
          Ember.$('.vector-results').show();
          Ember.$('.vector-result-tab').addClass("active");
          Ember.$('.raster-result-tab').removeClass("active");
      }
  },

  actions: {
      showTagGroup: function(tag) {
          if (Ember.$('#'+tag).is(':visible')) {
              Ember.$("#"+tag).hide(400);
          }
          else {
            Ember.$(".tag-group").hide(400);
            Ember.$("#"+tag).show(400);
          }
      },

      checkSingleTag: function(){
          var tags = this.collectCheckedTags();
          this.setProperties({ checkedTags: tags });
          this.getResults();
      },

      checkAllTagsInCategory: function(category, tags){

          var clickedTags = this.collectCheckedTags();
          var setTo;
          if (document.getElementById("checkbox-"+category).checked === true){
              Ember.$.each(tags, function(index, tag) {
                  clickedTags.push(tag.get('name'));
                  setTo = true;
              });
          }
          else if (document.getElementById("checkbox-"+category).checked === false) {
              Ember.$.each(tags, function(index, tag) {
                  clickedTags.splice(tag, 1);
                  setTo = false;
              });

          }
          this.setProperties({ checkedTags: clickedTags });
          this.getResults();
          Ember.$('input.'+category).each(function(){
              this.checked = setTo;
          });

      },

      selectedInstitution: function(institution){
          this.setProperties({selectedInstitution: institution});
          this.getResults();
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
