import DS from 'ember-data';

const {
    Model,
    attr
} = DS;

export default Model.extend({
    displayname: attr('string'),
    avatar: attr('string'),
    // institution_: belongsTo('institution'),
    // projects: hasMany('projects'),
    number_tagged: attr('number')
});
