import Ember from 'ember';

export default Ember.Service.extend({
    tags: null,

    init(){
        this._super(...arguments);
        this.set('searchText', '');
        this.set('tags', []);
        this.set('institutions', []);
    },
    setSearchText(searchTerms){
        this.setProperties({searchText: searchTerms});
    },
    add(tag){
        this.get('tags').pushObject(tag.get('name'));
    },
    remove(tag){
        this.get('tags').removeObject(tag.get('name'));
    },
    addAllTags(allTags){
        this.get('tags').pushObjects(allTags.getEach('name'));
    },
    removeAllTags(allTags){
        this.get('tags').removeObjects(allTags.getEach('name'));
    },
    addInstitution(institution){
        this.get('institutions').pushObjects(institution.get('name'));
    }
});
