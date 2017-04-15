/* eslint new-cap: ["error", { "newIsCapExceptions": ['htmlSafe'] }] */
import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';

const {
  Model,
  attr,
  belongsTo,
  hasMany
} = DS;

const {
  computed,
  get,
  inject: {
    service
  },
  String: {
      htmlSafe
  }
} = Ember;

export default Model.extend({
    /*
    * Extended by RasterLayer and VectorLayer
    */
    name: attr('string'),
    title: attr('string'),
    slug: attr('string'),
    keywords: attr('string'),
    description: attr('string'),
    safe_description: computed(function safeDescription() {
        return new htmlSafe(`${get(this, 'description')}`);
    }),
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
    tag_ids: hasMany('tag'),
    institution: attr(),
    institution_id: belongsTo('institution'),
    tag_slugs: attr('string'),
    active: attr('boolean'),
    active_in_project: attr('boolean', {
        defaultValue: false
    }),
    active_in_list: attr('boolean', {
        defaultValue: false
    }),
    shareable_link_id: computed(function shareableLinkId() {
        return `${get(this, 'name')}_sharable`;
    }),
    shareable_link_id_selector: computed(function shareableLinkId() {
        return `#${get(this, 'name')}_sharable`;
    }),
    absolute_url: computed(function absoluteUrl() {
        return `${ENV.absoluteBase}/layers/${get(this, 'name')}`;
    }),
    url: attr('string'),
    leaflet_id: attr('number'),
    leaflet_object: attr(),
    opacity: attr('number'),
    slider_id: attr('string'),
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
