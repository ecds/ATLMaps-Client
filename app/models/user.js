import DS from 'ember-data';

const {
    Model,
    attr,
    belongsTo
} = DS;

export default Model.extend({
    displayname: attr('string'),
    avatar: attr('string'),
    institution_id: belongsTo('institution'),
    institution: attr(),
    project_ids: attr(),
    projects: attr(),
    number_tagged: attr('number')
});
