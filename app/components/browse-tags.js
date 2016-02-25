import Ember from 'ember';

export default Ember.Component.extend({

    browseParams: Ember.inject.service('browse-params'),

    actions: {
        checkSingleTag(tag){
            if (tag.get('checked') === true) {
                this.get('browseParams').remove(tag);
            }
            else if (tag.get('checked') === false) {
                this.get('browseParams').add(tag);
            }
            tag.toggleProperty('checked');
            this.sendAction('getResults');
        },

        checkAllTagsInCategory: function(category){
            let allChecked = category.get('allChecked');
            let tags = category.get('sortedTags');
            if (allChecked === false) {
                this.get('browseParams').addAllTags(tags);
            }
            else {
                this.get('browseParams').removeAllTags(tags);
            }
            category.toggleProperty('allChecked');
            console.log(allChecked);
            tags.forEach(function(tag){
                tag.set('checked', category.get('allChecked'));
            });
            this.sendAction('getResults');
        },

        showTagGroup: function(category) {
            // There is a non-api backed boolean on the category model for `clicked`
            // This is what is used for showing the tags for the clicked category.
            // A property is set on this component, `clickedCategory` to the clicked
            // category and that is used to show/hide the tags in the templete.

            // When a category is clicked, we want to clear out the previous one.
            // console.log(category.get('name'));
            try {
                // Toggle the totally made up property!
                this.set('clickedCategory.clicked', !this.get('clickedCategory.clicked'));
            }
            catch(err) {
                // The first time, clickedCategory will not be an instance
                // of `category`. It will just be `true`.
            }
            // So if the category that is clicked does not match the one in the
            // `clickedCategory` property, we set the `clicked` attribute to `true`
            // and that will remove the `hidden` class in the template.
            if (category !== this.get('clickedCategory')){
                // Update the `clickedCategory` property
                this.set('clickedCategory', category);
                // Set the model attribute
                category.set('clicked', 'true');
            }
            // Otherwise, this must be the first time a user has clicked a category.
            else {
                //  this.set('clickedCategory', true);
            }

        }
    }
});
