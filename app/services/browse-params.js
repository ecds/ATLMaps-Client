import Ember from 'ember';

// Service to keep track of what a user is browsing so they are persistent
// while she is in the route. `clearAll` is called when the user leavs the
// project route.
const {
    Service,
    get
} = Ember;

export default Service.extend({

    init() {
        this._super(...arguments);
        this.setProperties({
            searchText: '',
            tags: [],
            institutions: [],
            start_year: '',
            end_year: '',
            bounds: {},
            searchLimit: '10'
        });
    },

    setSearchText(searchText) {
        this.setProperties({ searchText });
    },

    addTag(tag) {
        get(this, 'tags').pushObject(tag.get('name'));
    },

    removeTag(tag) {
        get(this, 'tags').removeObject(tag.get('name'));
    },

    addInstitution(institution) {
        const institutions = get(this, 'institutions');
        if (!institutions.includes(get(institution, 'name'))) {
            institutions.pushObject(institution.get('name'));
        }
    },

    removeInstution(institution) {
        get(this, 'institutions').removeObject(institution);
    },

    addAllTags(allTags) {
        get(this, 'tags').pushObjects(allTags.getEach('name'));
    },

    removeAllTags(allTags) {
        get(this, 'tags').removeObjects(allTags.getEach('name'));
    },

    setYearSearch(min_year, max_year) {
        this.setProperties({ start_year: min_year, end_year: max_year });
    },

    toggleRasterActive() {
        this.toggleProperty('rastersActive');
    }
});
