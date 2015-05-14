import DS from 'ember-data';

export default DS.Model.extend({
	displayname: DS.attr('string'),
    avatar: DS.attr('string'),
    institution_id: DS.belongsTo('institution'),
    institution: DS.attr(),
    project_ids: DS.attr(),
    projects: DS.attr()
});
