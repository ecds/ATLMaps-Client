import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({

    identification: attr('string'),
    password: attr('string'),
    password_confirmation: attr('string')
});
