import Ember from 'ember';

// Service to keep track of what a user is browsing so they are persistent
// while she is in the route. `clearAll` is called when the user leavs the
// project route.
const {
    Service,
    set
} = Ember;

export default Service.extend({

    init() {
        this._super(...arguments);
        this.set('searchText', '');
        this.set('tags', []);
        this.set('institutions', []);
        this.set('start_year', '');
        this.set('end_year', '');
        set(this, 'bounds', null);
    },
    setSearchText(searchTerms) {
        this.setProperties({ searchText: searchTerms });
    },
    addTag(tag){
        this.get('tags').pushObject(tag.get('name'));
    },
    removeTag(tag){
        this.get('tags').removeObject(tag.get('name'));
    },
    addInstitution(institution){
        this.get('institutions').pushObject(institution.get('name'));
    },
    removeInstution(institution){
        this.get('institutions').removeObject(institution.get('name'));
    },
    addAllTags(allTags){
        this.get('tags').pushObjects(allTags.getEach('name'));
    },
    removeAllTags(allTags){
        this.get('tags').removeObjects(allTags.getEach('name'));
    },
    setYearSearch(min_year, max_year){
        this.setProperties({start_year: min_year, end_year: max_year});
    },
    toggleRasterActive(){
        this.toggleProperty('rastersActive');
    }
});
