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

  // clickedCategory: function(){
  //     return true;
  // }.property(),

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

  // panelActions: Ember.inject.service(),

  categories: function(){
    // Return a sorted list of all categories.
    // The tags are sorted on the model.
    return Ember.ArrayProxy.create({
        content: this.store.findAll('category'),
        sort: function(){
            this.set('sortProperties', ['name']);
            // this.set('clicked', false);
        }
    });
  }.property(),

  checkedTags: function(){
      return [];
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
  // checkedTags: '',

  results: function() {
      return this.store.queryRecord('search', {});
  }.property('results'),

  getResults: function(){
    //   var tags = this.get('checkedTags');
    // var tags = this.store.peekAll('tag');
    // var tags = this.store.peekAll('tag', {id: 24});
    let tags = this.get('checkedTags');
    // var tags = this.get('checkedTags');
    // console.log(tags);
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
                _this.set('rastersActive', false);
              }
              else if (vectorCount === 0 && rasterCount > 0) {
                _this.set('rastersActive', true);
              }
          });
      }
      else {
          this.setProperties({results: []});
      }

  },

  collectCheckedTags: function(){
    //   var tags = [];
    //   // Clear the `category-checked`
    //   Ember.$('.category').removeClass('category-checked');
    //   // Hice the checkmark
    //   Ember.$('.category-checked i').hide();
    //   // Make an array of all the checked tags.
    //   Ember.$(".tags:checked").each(function(){
    //       tags.push(this.name);
    //     var category = Ember.$(this).attr('category');
    //     Ember.$('.category#category-'+category).addClass('category-checked');
    //     // Show the check mark.
    //     Ember.$("#check-"+category).show();
    //   });
    //   var tags = this.store.peekAll('tag', {checked: true});
    // //   console.log(tags);
    //   Ember.$.each(tags, function(index, tag) {
    //     //   console.log(tag)
    //   });
    //   return tags;
    //   Ember.$.each(tags, function(index, tag){
        //   checkedTags.push(tag);
        // console.log(tag);
    //   });
    //   console.log(checkedTags);
    //   return checkedTags;
  },

  collectCheckedInsts: function(){
      var insts = [];
      Ember.$(".inst-check:checked").each(function(){
          insts.push(this.name);
      });
      return insts;
  },

  didInsertElement: function() {},

  didUpdate: function(){},


  actions: {
        showTagGroup: function(category) {
          // There is a non-api backed boolean on the category model for `clicked`
          // This is what is used for showing the tags for the clicked category.
          // A property is set on this component, `clickedCategory` to the clicked
          // category and that is used to show/hide the tags in the templete.

          // When a category is clicked, we want to clear out the previous one.
          try {
              // Toggle the totally made up property!
              this.set('clickedCategory.clicked', !this.get('clickedCategory.clicked'));
          }
         catch(err) {
             // The first time, clickedCategory will not be an instance
             // of `category`. It will just be `true`.
         }
         // So if the category that is clicked does not match the one in the
         // `clickedCategory` property, we set the `clicked` attribute to `true`
         // and that will remove the `hidden` class in the template.
         if (category !== this.get('clickedCategory')){
                // Update the `clickedCategory` property
                this.set('clickedCategory', category);
                // Set the model attribute
                category.set('clicked', 'true');
         }
         // Otherwise, this must be the first time a user has clicked a category.
         else {
            //  this.set('clickedCategory', true);
         }

    },

      checkSingleTag: function(category, tag){
          // Much like `checked` attribute for categories described above, here
          // we go with tags. Tags are a little different because they are part
          // of an array that is sent to the `getResuts` method.
          var tagName = tag.get('name');
          var checkedTags = this.get('checkedTags');
          if (tag.get('checked') === true) {
              // We are removing the tag for the search
              tag.set('checked', false);
              var index = checkedTags.indexOf(tagName);
              checkedTags.splice(index, 1);

          }
          else {
              // Adding the tag to the list of checked tags.
              tag.set('checked', true);
              checkedTags.push(tagName);
              // TODO clear the select all box when when a user has selected all
              // but then unchecks a tag. This action need acesse to the category.
          }
          if (this.$("ul#"+category.get('slug')).find("input:checked").length > 0){
              category.set('checked', true);
          }
          else {
              category.set('checked', false);
          }
          this.getResults();
      },

      checkAllTagsInCategory: function(category){

        var set = category.get('allChecked');
        var checkedTags = this.get('checkedTags');
        if (set === false) {
            category.set('allChecked', true);
            for (var checkedTag of category.get('sortedTags')) {
                checkedTag.set('checked', true);
                checkedTags.push(checkedTag.get('name'));
                // Make sure there are no duplicates in the array.
                this.set('checkedTags', [...new Set(checkedTags)]);
                category.set('checked', true);
            }
        }
        else {
            category.set('allChecked', false);
            for (var unCheckedTag of category.get('sortedTags')) {
                // console.log(unCheckedTag);
                unCheckedTag.set('checked', false);
                var index = checkedTags.indexOf(unCheckedTag.get('name'));
                checkedTags.splice(index, 1);
                category.set('checked', false);
            }
        }
        this.getResults();
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
          //TODO make the year slider update a property
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
        //   console.log(layer);
          this.sendAction('addVector', layer);
      },

      sendVectorLayerToRemove: function(layer){
          this.sendAction('removeVector', layer);
      }
  }
});
