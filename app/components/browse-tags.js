import Ember from 'ember';

const {
    Component,
    inject: {
        service
    }
} = Ember;

export default Component.extend({

    browseParams: service(),

    classNames: ['browse-by-tags', 'container'],

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

    //     showTagGroup(category) {
    //         // There is a non-api backed boolean on the category model for `clicked`
    //         // This is what is used for showing the tags for the clicked category.
    //         // A property is set on this component, `clickedCategory` to the clicked
    //         // category and that is used to show/hide the tags in the templete.
    //
    //         // When a category is clicked, we want to clear out the previous one.
    //         try {
    //             // Toggle the totally made up property!
    //             // The `!` in the second argument toggles the true/false state.
    //             this.set('clickedCategory.clicked', !this.get('clickedCategory.clicked'));
    //         } catch (err) {
    //             // The first time, clickedCategory will not be an instance
    //             // of `category`. It will just be `undefined`.
    //         }
    //         // So if the category that is clicked does not match the one in the
    //         // `clickedCategory` property, we set the `clicked` attribute to `true`
    //         // and that will remove the `hidden` class in the template.
    //         if (category !== this.get('clickedCategory')) {
    //             // Update the `clickedCategory` property
    //             this.set('clickedCategory', category);
    //             // Set the model attribute
    //             category.set('clicked', 'true');
    //         }
    //         // Otherwise, this must be the first time a user has clicked a category.
    //         else {
    //             set(this, 'clickedCategory', true);
    //         }
    //
    //     }
    }
});
