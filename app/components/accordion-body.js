import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    classNameBindings: ['isExpanded:expanded'],
    isExpanded() {
        return this.get('isExpanded')
    }
});
