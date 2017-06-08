import DS from 'ember-data';

const {
    Model,
    attr
} = DS;

export default Model.extend({
    displayname: attr('string'),
    avatar: attr('string'),
    confirmed: attr('boolean')
});
