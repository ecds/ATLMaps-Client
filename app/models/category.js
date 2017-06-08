import DS from 'ember-data';
import Ember from 'ember';

const {
    Model,
    attr,
    hasMany
} = DS;
const {
    computed,
    get
} = Ember;

export default Model.extend({
    name: attr('string'),
    slug: attr('string'),
    tags: hasMany('tag'),

    // Non-API attribute to show the tags for the category.
    clicked: attr('boolean', {
        defaultValue: false
    }),
    // Non-API attribute to show if the tags in the category have been checked.
    // allChecked: attr('boolean', {
    //     defaultValue: false
    // }),
    // TODO This doesn't get re-computed when a single tag is checked.
    // allChecked: computed.equal('tag_ids.length', 'tagsChecked.length').property('tagsChecked'),
    allChecked: computed(function allChecked() {
        return get(this, 'tags.length') === get(this, 'tagsChecked.length');
    }).property('tagsChecked'),
    // displayName: computed(function absoluteUrl() {
    //     return get(this, 'tag_ids.length');
    // }),
    // displayName: computed(function absoluteUrl() {
    //     return get(this, 'tag_ids.length');
    // }),

    // Add that little checkmark next to a category that that has a checked tag
    // because everyone wanted it.
    tagsChecked: computed.filterBy('tags', 'checked', true),
    checked: computed.gt('tagsChecked.length', 0),

    // Property to sort the tags by name
    sortedTags: computed.sort('tags', '_nameSort'),
    _nameSort: ['name:asc']

});
