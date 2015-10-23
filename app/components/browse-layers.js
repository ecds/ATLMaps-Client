import Ember from 'ember';

export default Ember.Component.extend({

  categories: function(){
    return this.store.findAll('category');
  }.property(),


  results: function() {
    var _this = this;
    var results = this.store.queryRecord('search', {tags: 'not a real tag'});
    Ember.run.later(this, function() {
      var tags = [];
      Ember.$(".tags").click(function() {
        if(this.checked) {
          tags.push(this.name);
          results = _this.store.queryRecord('search', {tags: tags});
        }
        else if (!this.checked) {
          var tag = tags.indexOf(this.name);
          delete tags[tag];
          return _this.store.queryRecord('search', {tags: tags});
        }
      });
    }, 200);
    return results;
  }.property('results'),

  didInsertElement: function() {

  },

  actions: {

  }
});
