import DS from 'ember-data';
import Ember from 'ember';

const {
    Model,
    attr,
    belongsTo,
    hasMany
} = DS;

const { computed, get, inject: { service } } = Ember;

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
    url: attr('string'),
    leaflet_id: attr('number'),
    leaflet_object: attr(),
    opacity: attr('number'),
    mapObject: service(),
    showing: computed(function visiableLayer() {
        if (get(this, 'leaflet_object')) {
            if (Number.parseInt(get(this, 'opacity'), 10) !== 0) {
                get(this, 'leaflet_object').addTo(get(this, 'mapObject.map'));
                return true;
            }
            get(this, 'leaflet_object').remove();
            return false;
        }
        return true;
    }).property('opacity')
});
