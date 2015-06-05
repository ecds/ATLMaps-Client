import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
    description: DS.attr('string'),
    user_id: DS.attr(),
    saved: DS.attr('boolean'),
    published: DS.attr('boolean'),
    user: DS.attr(),
    layer_ids: DS.attr(),
    slug: DS.attr('string'),
    user_ids: DS.attr(),
    owner: DS.attr(),
    is_mine: DS.attr('boolean'),
    may_edit: DS.attr('boolean')
});
