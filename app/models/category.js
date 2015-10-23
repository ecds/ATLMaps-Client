import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  tag_ids: DS.hasMany('tag', {async: true}),
});
