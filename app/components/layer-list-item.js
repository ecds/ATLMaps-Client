import Ember from 'ember';

const {
    Component
} = Ember;

export default Component.extend({
    tagName: '',

    actions: {
        open() {
            console.log('hello');
        }
    }
});
