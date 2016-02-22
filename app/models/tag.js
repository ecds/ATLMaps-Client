import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  slug: DS.attr('string'),
  rsterLayer_ids: DS.hasMany('rasterLayer', {async: true}),
  vectorLayer_ids: DS.hasMany('vectorLayer', {async: true}),
  category_ids: DS.hasMany('category', {async: true}),
  checked: DS.attr('boolean', { defaultValue: false })
});
