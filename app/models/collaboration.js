import DS from 'ember-data';

const {
    Model,
    attr
} = DS;

export default Model.extend({
    user_id: attr('number'),
    project_id: attr('number'),
    user: attr('string')
});
