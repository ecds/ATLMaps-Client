import DS from 'ember-data';

/*
    The json representation for a project has two arrays
    for the associated layers. `layers` is just a simple
    array and `layer_ids` represents the association.
    This is awesome, but as we are looking up the layers
    twice. The way that Ember Data represents the association
    here makes it hard to iterate over them to send to the 
    `mapLayer` action. :(
*/

export default DS.Model.extend({
	name: DS.attr('string'),
    description: DS.attr('string'),
    user_id: DS.attr(),
    saved: DS.attr('boolean'),
    published: DS.attr('boolean'),
    user: DS.attr(),
    layer_ids: DS.hasMany('layer', {async: true}),
    layers: DS.attr(),
    slug: DS.attr('string'),
    user_ids: DS.attr(),
    owner: DS.attr(),
    is_mine: DS.attr('boolean'),
    may_edit: DS.attr('boolean')
});
