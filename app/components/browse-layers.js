import Ember from 'ember';

export default Ember.Component.extend({
  results: function() {
      var results = this.store.queryRecord('search', {tags: ['1928', 'oral history']});
      console.log(results);
      return results;
  }.property(),
});
