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

  // Number of tags that are checked.
  checkedTags: 0,

  results: function() {
      return this.store.queryRecord('search', {});
  }.property('results'),

  getResults: function(tags){
      // Because this gets called in the `didUpdate` runs after the template has
      // re-rendered and the DOM is now up to date. We don't want to make the
      // call to the API everytime, so we check to see if the length of the
      // `tags` is equal to the value of `checkedTags`. If they don't, it means
      // a tag was selected or de-selected and we should run the qurey. Then
      // we update `checkedTags` so they will match the next time the template
      // updates.
      var stored = this.get('checkedTags');
      if (tags.length !== stored ){
          var results = this.store.queryRecord('search', {tags: tags});
          this.setProperties({ checkedTags: tags.length });
          this.setProperties({ resluts: results });
      }

  },
  didUpdate: function() {
      var tags = [];
      // Since this runs everytime the DOM updates, we need to get the
      // tags that are already cheked and push them back into the array.
      Ember.$(".tags:checked").each(function(){
          tags.push(this.name);
      });
      var _this = this;
      Ember.$(".tags").click(function() {
        if(this.checked) {
          tags.push(this.name);
        }
        else if (!this.checked) {
          var tag = tags.indexOf(this.name);
          tags.splice(tag, 1);
        }
        _this.getResults(tags);
      });

      var results = this.get('results');

      var rasterCount = results.get('content.raster_layer_ids.length');

      var vectorCount = results.get('content.vector_layer_ids.length');

      if (rasterCount > vectorCount) {
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
