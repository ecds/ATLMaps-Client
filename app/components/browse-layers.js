import Ember from 'ember';
/* globals noUiSlider */

export default Ember.Component.extend({

  yearRange: function(){
    return this.store.find('yearRange', 1);
  }.property(),

  didRender: function(){
    var _this = this;
    var range = this.get('yearRange');
    var min = range.get('content.min_year');
    var max = range.get('content.max_year');

    // this.setProperties({startYear: min, endYear: max});

    var rangeSlider = document.getElementById('range');

    try {
      // Initializing the slider
      noUiSlider.create(rangeSlider, {
        start: [ min, max ],
        connect: true,
        range: {
          'min': min,
          'max': max
        }
      });

      // Linking the inputs
      var inputMinYear = document.getElementById('start_year');
      var inputMaxYear = document.getElementById('end_year');

      rangeSlider.noUiSlider.on('update', function( values, handle ) {
        var value = values[handle];
        if ( handle ) {
          inputMaxYear.value = Math.round(value);
        } else {
          inputMinYear.value = Math.round(value);
        }
      });

      inputMaxYear.addEventListener('change', function(){
        rangeSlider.noUiSlider.set([null, this.value]);
      });

      inputMinYear.addEventListener('change', function(){
        rangeSlider.noUiSlider.set([this.value, null]);
      });

      rangeSlider.noUiSlider.on('set', function(){
        _this.send('yearFilter');
      });

    }
    catch(err){
      // Don't care
    }
  },

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

  textSearch: '',

  startYear: 0,

  endYear: 0,

  // Number of tags that are checked.
  checkedTags: '',

  results: function() {
      return this.store.queryRecord('search', {});
  }.property('results'),

  getResults: function(){
      var tags = this.get('checkedTags');
      var institution = this.get('selectedInstitution');
      var search = this.get('textSearch');
      var start_year = this.get('startYear');
      var end_year = this.get('endYear');

      var searchResults = this.store.queryRecord('search', {
        tags: tags,
        name: institution,
        text_search: search,
        start_year: start_year,
        end_year: end_year
      });

      if (tags.length > 0 || institution !== '' || search !== '' || start_year > 0 || end_year > 0) {
          this.setProperties({ results: searchResults });
      }
      else {
          this.setProperties({results: []});
      }
      Ember.$('#new-search').hide();

  },

  collectCheckedTags: function(){
      var tags = [];
      Ember.$(".tags:checked").each(function(){
          tags.push(this.name);
      });
      return tags;
  },

  didInsertElement: function() {
      // Ember.$(".browse-cards div.browse-form").hide();
      Ember.$(".browse-by-tags").show();
      Ember.$('.nav-browse').slideDown('slow');
  },

  showResults: function (toShow, toHide){
    Ember.$('.'+toHide+'-results').hide();
    Ember.$('.'+toShow+'-results').show();
    Ember.$('.'+toShow+'-result-tab').addClass("active");
    Ember.$('.'+toHide+'-result-tab').removeClass("active");
  },

  didUpdate: function() {
      var activeRasterCount = parseInt(Ember.$('.raster-badge').text());
      var activeVectorCount = parseInt(Ember.$('.vector-badge').text());

      // Only want to select the active results tab the first time we
      // load results. We pick the one wiht the most results to start.
      if (Ember.$(".browse-nav-button").hasClass("active") === false){
            var results = this.get('results');
            var rasterCount = results.get('content.raster_layer_ids.length');
            var vectorCount = results.get('content.vector_layer_ids.length');

            if ((rasterCount === 0 || rasterCount === 'undefined') && (vectorCount === 0 || vectorCount === 'undefined') ){
                Ember.$('.browse-results').hide();
            }
            else{
                Ember.$('.browse-results').show();
            }

            if (vectorCount > rasterCount) {
              this.showResults('vector', 'raster');
            }
            else if (rasterCount > vectorCount){
              this.showResults('raster', 'vector');
            }
        }
        // This is for when results have been loaded and change the filters
        // and the previous active type's count falls to 0. We want to switch
        // to the tab that isn't 0.
        else if (activeRasterCount === 0 && activeVectorCount > 0) {
          console.log('show vector');
          this.showResults('vector', 'raster');
        }
        else if (activeVectorCount === 0 && activeRasterCount > 0) {
          console.log('show raster');
          this.showResults('raster', 'vector');
        }
        else if (activeVectorCount === 0 && activeRasterCount === 0) {
            Ember.$('#none-found').show();
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

      search: function(){
        this.setProperties({textSearch: Ember.$('#search-field').val()});
        this.getResults();
      },

      yearFilter: function(){
        var min = Ember.$('#start_year').val();
        var max = Ember.$('#end_year').val();
        this.setProperties({startYear: min, endYear: max});
        this.getResults();
      },

      sendRasterLayerToAdd: function(layer){
          this.sendAction('addRaster', layer);
      },

      sendRasterLayerToRemove: function(layer){
          this.sendAction('removeRaster', layer);
      },

      sendVectorLayerToAdd: function(layer){
          console.log(layer);
          this.sendAction('addVector', layer);
      },

      sendVectorLayerToRemove: function(layer){
          this.sendAction('removeVector', layer);
      }
  }
});
