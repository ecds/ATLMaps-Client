import DS from 'ember-data';

const {
    Model,
    attr,
    belongsTo,
    hasMany
} = DS;

export default Model.extend({
    /*
     * Extended by RasterLayer and VectorLayer
     */
    name: attr('string'),
    title: attr('string'),
    slug: attr('string'),
    keywords: attr('string'),
    description: attr('string'),
    layer: attr('string'),
    date: attr('date'),
    data_type: attr('string'),
    data_format: attr('string'),
    zoomlevels: attr('string'),
    minx: attr('number'),
    miny: attr('number'),
    maxx: attr('number'),
    maxy: attr('number'),
    project_ids: hasMany('project', {
        async: true
    }),
    tag_ids: hasMany('tag', {
        async: true
    }),
    institution: attr(),
    institution_id: belongsTo('institution'),
    tag_slugs: attr('string'),
    active: attr('boolean'),
    active_in_project: attr('boolean', {
        defaultValue: false
    }),
    url: attr('string')
});
