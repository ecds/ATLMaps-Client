import Ember from 'ember';

export default Ember.Component.extend({
    flashMessage: Ember.inject.service('flash-message'),

    classNames: ['flash-message']
});
