import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  slug: DS.attr('string'),
  tag_ids: DS.hasMany('tag', {async: true}),

  // Property to sort the tags by name
  sortedTags: Ember.computed.sort('tag_ids', '_nameSort'),
  _nameSort: ['name:asc']

});
