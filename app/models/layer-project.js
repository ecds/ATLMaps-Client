import DS from 'ember-data';

export default DS.Model.extend({
    project_id: DS.attr(),
    data_format: DS.attr(),

    // Non-API property. Used to show/hide the layer's description in the list.
    clicked: DS.attr('boolean', {
        defaultValue: false
    }),
    showing: DS.attr('boolean', {
        defaultValue: true
    })
});
