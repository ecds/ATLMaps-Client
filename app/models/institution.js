import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
    slug: DS.attr('string'),
    geoserver: DS.attr('string'),
    layer_ids: DS.hasMany('layer', {async: true}),
    user_ids: DS.hasMany('user', {async: true}),
	checked: DS.attr('boolean', { defaultValue: false })
});
