import Ember from 'ember';

const {
    $,
    Component,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-tags'],

    didInsertElement() {
        $('.collapsible').collapsible();
    },

    actions: {
        checkSingleTag(tag, category) {
            if (tag.get('checked') === true) {
                this.get('browseParams').removeTag(tag);
                // FIXME This should be computed and not
                // require an explicit setting
                category.set('allChecked', false);
            } else if (tag.get('checked') === false) {
                this.get('browseParams').addTag(tag);
            }
            tag.toggleProperty('checked');
            this.sendAction('getResults');
        },

        checkAllTagsInCategory(category) {
            let allChecked = category.get('allChecked');
            let tags = category.get('sortedTags');
            if (allChecked === false) {
                this.get('browseParams').addAllTags(tags);
            } else {
                this.get('browseParams').removeAllTags(tags);
            }
            category.toggleProperty('allChecked');
            tags.forEach(function(tag) {
                tag.set('checked', category.get('allChecked'));
            });
            this.sendAction('getResults');
        }
    }
});
