import DS from 'ember-data';

export default DS.Model.extend({
  min_year: DS.attr('number'),
  max_year: DS.attr('number')
});
