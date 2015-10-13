import DS from 'ember-data';

export default DS.Model.extend({
	user_id: DS.attr(),
    project_id: DS.attr(),
    user: DS.attr()
});
