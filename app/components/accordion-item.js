import Ember from 'ember';

export default Ember.Component.extend({
    item: null,
    activeItem: null,

    isExpanded: Ember.computed('activeItem', 'item', function() {
        return this.get('activeItem') === this.get('item');
    })
});
