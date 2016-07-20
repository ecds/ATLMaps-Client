import DS from 'ember-data';

export default DS.Model.extend({
    /*
    * Extended by RasterLayer and VectorLayer
    */
    name: DS.attr('string'),
    title: DS.attr('string'),
    slug: DS.attr('string'),
    keywords: DS.attr('string'),
    description: DS.attr('string'),
    layer: DS.attr('string'),
    date: DS.attr('date'),
    data_type: DS.attr('string'),
    data_format: DS.attr('string'),
    zoomlevels: DS.attr('string'),
    minx: DS.attr('number'),
    miny: DS.attr('number'),
    maxx: DS.attr('number'),
    maxy: DS.attr('number'),
    project_ids: DS.hasMany('project', {async: true}),
    tag_ids: DS.hasMany('tag', {async: true}),
    institution: DS.attr(),
    institution_id: DS.belongsTo('institution'),
    tag_slugs: DS.attr('string'),
    active: DS.attr('boolean'),
    active_in_project: DS.attr('boolean', { defaultValue: false }),
    url: DS.attr('string'),
});
