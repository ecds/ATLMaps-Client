import Ember from 'ember';
import DS from 'ember-data';
/* globals noUiSlider */

export default Ember.Component.extend({

  searchMade: function(){
    return false;
  }.property(),

  rastersActive: function(){
      return false;
  },

  yearRange: function(){
      var _this = this;
      var yearRange = DS.PromiseObject.create({
          promise: this.store.find('yearRange', 1)
      });

      yearRange.then(function(){
          var range = yearRange;
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
          return yearRange;
      });
  }.property(),

  didRender: function(){

  },

  // panelActions: Ember.inject.service(),

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

  checkedInstitutions: '',

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
      var institutions = this.get('checkedInstitutions');
      var search = this.get('textSearch');
      var start_year = this.get('startYear');
      var end_year = this.get('endYear');
      var _this = this;

      var searchResults = DS.PromiseObject.create({
        promise: this.store.queryRecord('search', {
            tags: tags,
            name: institutions,
            text_search: search,
            start_year: start_year,
            end_year: end_year
        })
      });

      if (tags.length > 0 || institutions.length > 0 || search !== '' || start_year > 0 || end_year > 0) {

          searchResults.then(function(){
              _this.setProperties({ results: searchResults });
              var rasterCount = searchResults.get('content.raster_layer_ids.length');
              var vectorCount = searchResults.get('content.vector_layer_ids.length');
              if (_this.get('searchMade') === false) {
                  if (rasterCount > vectorCount) {
                      _this.set('rastersActive', true);
                  }
                _this.set('searchMade', true);
              }
              // This is for when results have been loaded and change the filters
              // and the previous active type's count falls to 0. We want to switch
              // to the tab that isn't 0.
              else if (rasterCount === 0 && vectorCount > 0) {
                _this.set('rastersActive', false)
              }
              else if (vectorCount === 0 && rasterCount > 0) {
                _this.set('rastersActive', true)
              }
          });
      }

    //   if (tags.length > 0 || institutions.length > 0 || search !== '' || start_year > 0 || end_year > 0) {
    //       this.setProperties({ results: searchResults });
    //       if (this.get('searchMade') === false) {
    //           console.log(searchResults)
    //         this.set('searchMade', true);
    //       }
    //   }
      else {
          this.setProperties({results: []});
      }

  },

  collectCheckedTags: function(){
      var tags = [];
      // Clear the `category-checked`
      Ember.$('.category').removeClass('category-checked');
      // Hice the checkmark
      Ember.$('.category-checked i').hide();
      // Make an array of all the checked tags.
      Ember.$(".tags:checked").each(function(){
          tags.push(this.name);
        var category = Ember.$(this).attr('category');
        Ember.$('.category#category-'+category).addClass('category-checked');
        // Show the check mark.
        Ember.$("#check-"+category).show();
      });
      return tags;
  },

  collectCheckedInsts: function(){
      var insts = [];
      Ember.$(".inst-check:checked").each(function(){
          insts.push(this.name);
      });
      return insts;
  },

  didInsertElement: function() {
      // Ember.$(".browse-cards div.browse-form").hide();
    //   Ember.$(".browse-by-tags").show();
    //   Ember.$('.nav-browse').slideDown('slow');
  },

  // showResults: function (toShow, toHide){
  //   Ember.$('.'+toHide+'-results').hide();
  //   Ember.$('.'+toShow+'-results').show();
  //   Ember.$('.'+toShow+'-result-tab').addClass("active-result-tab");
  //   Ember.$('.'+toHide+'-result-tab').removeClass("active-result-tab");
  // },

  didUpdate: function() {
    //   var activeRasterCount = parseInt(Ember.$('.raster-badge').text());
    //   var activeVectorCount = parseInt(Ember.$('.vector-badge').text());
    //
    //   // Only want to select the active results tab the first time we
    //   // load results. We pick the one wiht the most results to start.
    //   console.log(this.get('searchMade'))
    //   if (this.get('searchMade') === false){
    // //   if (Ember.$(".browse-nav-button").hasClass("active-result-tab") === false){
    //         var results = this.get('results');
    //         var rasterCount = results.get('content.raster_layer_ids.length');
    //         var vectorCount = results.get('content.vector_layer_ids.length');
    //
    //
    //         if (vectorCount > rasterCount) {
    //           this.showResults('vector', 'raster');
    //         }
    //         else if (rasterCount > vectorCount){
    //           this.showResults('raster', 'vector');
    //         }
    //     }


  },

  actions: {
      showTagGroup: function(category) {
          Ember.$('.category').removeClass('active');
          if (Ember.$('#'+category).is(':visible')) {
              Ember.$("#"+category).fadeOut(400);
          }
          else if (Ember.$('#'+category).is(':hidden')){
              Ember.$(".tag-group").fadeOut();
              Ember.$('#'+category).fadeIn(400);
              Ember.$('#category-'+category).addClass('active');
          }
          else {
              Ember.$(".tag-group").hide();
              Ember.$("#"+category).show();
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
                  Ember.$('.category#category-'+category).addClass('category-checked');
                  Ember.$("#check-"+category).show();
              });
          }
          else if (document.getElementById("checkbox-"+category).checked === false) {
              Ember.$.each(tags, function(index, tag) {
                  clickedTags.splice(tag, 1);
                  setTo = false;
                  Ember.$('.category#category-'+category).removeClass('category-checked');
                  Ember.$("#check-"+category).hide();
              });

          }
          this.setProperties({ checkedTags: clickedTags });
          this.getResults();
          Ember.$('input.'+category).each(function(){
              this.checked = setTo;
          });

      },

      checkInstitution: function(){
          var ints = this.collectCheckedInsts();
          this.setProperties({ checkedInstitutions: ints });
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

      showResults: function(show){
          if (show === 'vector') {
              this.set('rastersActive', false);
          }
          else if (show === 'raster') {
              this.set('rastersActive', true);
          }
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
