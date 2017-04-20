/**
 * @private
 * Component to track tags are currently being searched.
 * TODO: Would this be better in the `browseParams` service?
 */
import Ember from 'ember';

const {
    $,
    get,
    Component,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-tags'],

    actions: {
        // If the tag is already checked, we remove it from the qurey. Otherwise
        // we add it.
        checkSingleTag(tag, category) {
            if (tag.get('checked') === true) {
                this.get('browseParams').removeTag(tag);
                // FIXME: This should be computed and not
                // require an explicit setting
                category.set('allChecked', false);
            } else if (tag.get('checked') === false) {
                this.get('browseParams').addTag(tag);
            }

            tag.toggleProperty('checked');
            this.sendAction('getResults');
        },

        // handle checking/un-checking all tags.
        checkAllTagsInCategory(category) {
            // FIXME: For real yo!
            const allChecked = category.get('allChecked');
            const tags = category.get('sortedTags');

            if (allChecked === false) {
                this.get('browseParams').addAllTags(tags);
                // This is so the tag list will expand when someone selects all.
                // It will not collapse when someone deselects all.
                if (!$(`#${get(category, 'slug')}`).hasClass('tfa-panel-tab--expanded')) {
                    $(`#${get(category, 'slug')}`).click();
                }
            } else {
                this.get('browseParams').removeAllTags(tags);
            }

            category.toggleProperty('allChecked');

            tags.forEach((tag) => {
                tag.set('checked', category.get('allChecked'));
            });

            this.sendAction('getResults');
        }
    }
});
