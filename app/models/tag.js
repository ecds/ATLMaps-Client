import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
    slug: DS.attr('string'),
    layer_ids: DS.hasMany('layer', {async: true})
});
