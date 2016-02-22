import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  slug: DS.attr('string'),
  tag_ids: DS.hasMany('tag', {async: true}),
  // Non-API attribute to show the tags for the category.
  clicked: DS.attr('boolean', { defaultValue: false }),
  // Non-API attribute to show if the tags in the category have been checked.
  cat_checked: DS.attr('boolean', { defaultValue: false }),
  allChecked: DS.attr('boolean', { defaultValue: false }),

  // Property to sort the tags by name
  sortedTags: Ember.computed.sort('tag_ids', '_nameSort'),
  _nameSort: ['name:asc']

});
