import Ember from 'ember';

export default Ember.Component.extend({
    items: null,
    activeItem: null,
    actions: {
        toggleActiveItem(item) {
            if (this.get('activeItem') !== item) {
                this.set('activeItem', item);
            } else {
                this.set('activeItem', null);
            }
        }
    }
});
